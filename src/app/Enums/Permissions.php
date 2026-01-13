<?php
namespace App\Enums;

enum Permissions: string
{
    // Admin Permissions
    case CRM_ACCESS = 'crm_access';
    case CREATE_USER = 'create_user';
    case EDIT_USER = 'edit_user';
    case DELETE_USER = 'delete_user';

    // Trainer permissions

    // Student permissions

    public function label(): string
    {
        return match ($this) {
            self::CRM_ACCESS => 'CRM Access',
            self::CREATE_USER => 'Create User',
            self::EDIT_USER => 'Edit User',
            self::DELETE_USER => 'Delete User',
        };
    }
}