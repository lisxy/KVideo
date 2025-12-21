'use server';

/**
 * Verifies if the provided password matches the ACCESS_PASSWORD environment variable.
 */
export async function verifyEnvPassword(password: string): Promise<boolean> {
    const accessPassword = process.env.ACCESS_PASSWORD;
    if (!accessPassword) return false;
    return password === accessPassword;
}

/**
 * Checks if a password is required by checking the presence of ACCESS_PASSWORD in the environment.
 */
export async function isEnvPasswordRequired(): Promise<boolean> {
    return !!process.env.ACCESS_PASSWORD;
}
