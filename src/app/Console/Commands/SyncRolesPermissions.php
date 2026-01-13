<?php

namespace App\Console\Commands;

use App\Enums\Permissions;
use Illuminate\Console\Command;
use Spatie\Permission\PermissionRegistrar;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SyncRolesPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-roles-permissions {--dry-run : Show changes without writing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $map = [
            'admin' => [
                Permissions::CRM_ACCESS->value,
                Permissions::CREATE_USER->value,
                Permissions::EDIT_USER->value,
                Permissions::DELETE_USER->value,
            ],
            'trainer' => [
                'program.create',
                'program.update',
                'program.delete',
                'program.assign',
                'client.view',
                'progress.view',
            ],
            'client' => [
                'program.view',
                'training.complete',
                'comment.create',
                'video.upload',
            ],
        ];

        $allPermissions = collect($map)->flatten()->unique()->values();

        $dry = (bool) $this->option('dry-run');

        foreach ($allPermissions as $permName) {
            if ($dry) {
                $this->line("Ensure permission: {$permName}");
            } else {
                Permission::firstOrCreate(['name' => $permName]);
            }
        }

        foreach ($map as $roleName => $perms) {
            if ($dry) {
                $this->line("Ensure role: {$roleName}");
                $this->line("Sync permissions to role {$roleName}: " . implode(', ', $perms));
                continue;
            }

            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($perms);
        }

        if (!$dry) {
            app(PermissionRegistrar::class)->forgetCachedPermissions();
        }

        $this->info('ACL sync complete.');

        return self::SUCCESS;
    }
}
