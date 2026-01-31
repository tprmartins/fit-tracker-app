import { UserRole } from "@/types/UserRole";

export interface RouteProtection {
    path: string;
    allowedRoles: UserRole[];
    exact?: boolean;
}

export const protectedRoutes: RouteProtection[] = [
    // Admin routes
    { path: "/admin", allowedRoles: [UserRole.Admin] },

    // Personal trainer routes
    { path: "/personal", allowedRoles: [UserRole.Personal] },

    // Student routes
    { path: "/student", allowedRoles: [UserRole.Student] },
];

/**
 * Check if a user with given role can access a specific path
 */
export function canAccessRoute(path: string, userRole: UserRole): boolean {
    const route = protectedRoutes.find(r => {
        if (r.exact) {
            return path === r.path;
        }
        return path.startsWith(r.path);
    });

    if (!route) {
        // Route not in protection list, allow access
        return true;
    }

    return route.allowedRoles.includes(userRole);
}

/**
 * Get the default dashboard path for a given role
 */
export function getDefaultDashboard(role: UserRole): string {
    switch (role) {
        case UserRole.Admin:
            return "/admin";
        case UserRole.Personal:
            return "/personal";
        case UserRole.Student:
            return "/student";
        default:
            return "/login";
    }
}
