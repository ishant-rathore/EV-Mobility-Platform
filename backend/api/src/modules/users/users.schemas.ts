import { z } from "zod";

export const updateMeSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  roleId: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});
