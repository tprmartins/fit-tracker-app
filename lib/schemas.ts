import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    document: z.string().min(11, "CPF deve ter no mínimo 11 caracteres"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    phone: z.string().optional(),
    role: z.number(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Complete Registration Schema
export const completeRegistrationSchema = z.object({
    document: z.string().min(11, "CPF inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
});

export type CompleteRegistrationFormData = z.infer<typeof completeRegistrationSchema>;

// Invite Student Schema
export const inviteStudentSchema = z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().optional(),
});

export type InviteStudentFormData = z.infer<typeof inviteStudentSchema>;

// Workout Schema
export const workoutSchema = z.object({
    studentId: z.string().uuid("Selecione um aluno válido"),
    name: z.string().min(3, "Nome do treino deve ter no mínimo 3 caracteres"),
    description: z.string().optional(),
    durationWeeks: z.number().min(1, "Duração deve ser de pelo menos 1 semana"),
    frequencyDays: z.number().min(1).max(7, "Frequência deve ser entre 1 e 7 dias"),
});

export type WorkoutFormData = z.infer<typeof workoutSchema>;
