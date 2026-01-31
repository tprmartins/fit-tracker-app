import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from './types/UserRole'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value

    // Rotas que exigem autenticação
    const protectedPaths = ['/personal', '/student', '/admin', '/profile']

    // Rotas de autenticação
    const authPaths = ['/login', '/register']

    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
    const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path))

    // Redirect to login if accessing protected route without token
    if (isProtected && !token) {
        const url = new URL('/login', request.url)
        return NextResponse.redirect(url)
    }

    // Role-based access control
    if (token && (isProtected || isAuthPath)) {
        try {
            // Decode JWT to get role (simple base64 decode of payload)
            const payload = JSON.parse(atob(token.split('.')[1]))
            const roleClaim = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

            // Handle both numeric strings and named roles
            let userRole: number;
            if (typeof roleClaim === 'string') {
                if (roleClaim === 'Personal') userRole = UserRole.Personal;
                else if (roleClaim === 'Student') userRole = UserRole.Student;
                else if (roleClaim === 'Admin') userRole = UserRole.Admin;
                else if (roleClaim === 'Owner') userRole = UserRole.Owner;
                else userRole = parseInt(roleClaim) || 0;
            } else {
                userRole = roleClaim;
            }

            const path = request.nextUrl.pathname

            // 1. Check role-based access for protected routes
            if (isProtected) {
                if (path.startsWith('/admin') && userRole !== UserRole.Admin && userRole !== UserRole.Owner) {
                    return NextResponse.redirect(new URL('/forbidden', request.url))
                }
                if (path.startsWith('/personal') && userRole !== UserRole.Personal) {
                    return NextResponse.redirect(new URL('/forbidden', request.url))
                }
                if (path.startsWith('/student') && userRole !== UserRole.Student) {
                    return NextResponse.redirect(new URL('/forbidden', request.url))
                }
            }

            // 2. Redirect authenticated users away from auth pages
            if (isAuthPath) {
                // Redirect to appropriate dashboard
                if (userRole === UserRole.Owner || userRole === UserRole.Admin) {
                    return NextResponse.redirect(new URL('/admin', request.url))
                } else if (userRole === UserRole.Personal) {
                    return NextResponse.redirect(new URL('/personal', request.url))
                } else if (userRole === UserRole.Student) {
                    return NextResponse.redirect(new URL('/student', request.url))
                }
            }
        } catch (error) {
            // If token is invalid, redirect to login
            console.error('Invalid token:', error)
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
