<?php

function core_admin_root(Action &$action){
    $adminApps = array();
    $query = <<< 'SQL'
SELECT
    application.name,
    application.id,
    application.icon,
    application.short_name,
    application.description,
    application.access_free,
    application.with_frame,
    action.acl
FROM application
LEFT JOIN action
ON application.id = action.id_application
WHERE
    application.tag ~* E'\\yadmin\\y'
    AND application.available = 'Y'
    AND application.name != 'CORE_ADMIN'
    AND action.root = 'Y'
ORDER BY short_name;
SQL;

    simpleQuery('', $query, $adminApps, false, false, true);

    $admin_apps = array();

    foreach ($adminApps as $adminApp) {
        if ($adminApp["access_free"] !== "Y") {
            if ($action->user->id != 1){ // no control for user Admin
                if (!$action->HasPermission($adminApp["acl"], $adminApp["id"])){
                    continue;
                }
            }
        }
        $appUrl = "?app=" . $adminApp["name"];
        if($adminApp["with_frame"] !== 'Y'){
            $appUrl .= "&sole=A";
        }
        $admin_apps[] = array(
            "NAME"          => $adminApp["name"],
            "URL"           => $appUrl,
            "ICON_SRC"      => $action->parent->getImageLink($adminApp["icon"], false, 24),
            "ICON_ALT"      => $adminApp["name"],
            "TITLE"         => _($adminApp["short_name"]),
            "DESCRIPTION"   => _($adminApp["description"])
        );
    }

    $action->lay->setBlockData('ADMIN_APPS', $admin_apps);
}

?>