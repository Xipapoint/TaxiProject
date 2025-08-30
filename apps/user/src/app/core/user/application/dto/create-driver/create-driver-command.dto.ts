/* TODO:
  ADD as fields:

    export const driverRegistrationSchema = userRegistrationSchema.safeExtend({
        licenseNumber: z.string().min(5, 'License number must be at least 5 characters'),
        vehicleModel: z.string().min(2, 'Vehicle model is required'),
        vehicleYear: z.number().min(1990, 'Vehicle year must be 1990 or later').max(new Date().getFullYear() + 1),
        vehiclePlateNumber: z.string().min(3, 'Plate number is required'),
        insuranceNumber: z.string().min(5, 'Insurance number is required'),
        emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
        emergencyContactPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid emergency contact phone'),
    });
   
*/
export interface CreateDriverCommandDto {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    password: string;
    licenseNumber?: string;
    vehicleModel?: string;
    vehicleYear?: number;
    vehiclePlateNumber?: string;
    insuranceNumber?: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
}