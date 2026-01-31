import { toast } from "sonner";

export interface ApiError {
    message: string;
    status?: number;
    errors?: Record<string, string[]>;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7115/api") {
        this.baseURL = baseURL;
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            let apiError: ApiError;
            try {
                const errorData = await response.json();
                apiError = {
                    message: errorData.detail || errorData.message || `Erro ${response.status}`,
                    status: response.status,
                    errors: errorData.errors
                };
            } catch {
                apiError = {
                    message: `Erro de servidor (${response.status})`,
                    status: response.status
                };
            }

            // Show toast for errors (except 401 which is handled by middleware)
            if (response.status !== 401) {
                toast.error(apiError.message);
            }

            throw apiError;
        }
        return response;
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (typeof window !== "undefined") {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("accessToken="))
                ?.split("=")[1];

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    private async safeFetch(url: string, options: RequestInit): Promise<Response> {
        try {
            const response = await fetch(url, options);
            return await this.handleResponse(response);
        } catch (error: any) {
            if (error.status) throw error; // Already handled by handleResponse

            const networkError: ApiError = {
                message: "Não foi possível conectar ao servidor. Verifique sua conexão.",
                status: 503
            };
            toast.error(networkError.message);
            throw networkError;
        }
    }

    async get(endpoint: string): Promise<Response> {
        return this.safeFetch(`${this.baseURL}${endpoint}`, {
            method: "GET",
            headers: this.getHeaders(),
        });
    }

    async post(endpoint: string, data?: any): Promise<Response> {
        return this.safeFetch(`${this.baseURL}${endpoint}`, {
            method: "POST",
            headers: this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put(endpoint: string, data?: any): Promise<Response> {
        return this.safeFetch(`${this.baseURL}${endpoint}`, {
            method: "PUT",
            headers: this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete(endpoint: string): Promise<Response> {
        return this.safeFetch(`${this.baseURL}${endpoint}`, {
            method: "DELETE",
            headers: this.getHeaders(),
        });
    }
}

export const api = new ApiClient();
