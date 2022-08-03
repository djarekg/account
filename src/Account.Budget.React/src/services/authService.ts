/**
 * Authorization service to handle user authentication.
 */
export class AuthService {
    /**
     * Check if the user is authenticated.
     * @returns True if the user is authenticated, false otherwise.
     */
    public async IsAuthenticated(): Promise<boolean> {
        try
        {
            const req = new Request(
                '/api/auth/isAuthenticated',
                {
                    method: 'GET'
                });
            const resp = await fetch(req);

            if (resp.status === 200)
            {
                return true;
            }

            throw new Error("Not authenticated");
        }
        catch (err)
        {
            return false;
        }
    }

    /**
     * Authenticate the user.
     * @param username The username of the user.
     * @param password The password of the user.
     * @returns True if the user is authenticated, false otherwise.
     */
    public async Login(username: string, password: string): Promise<boolean> {
        try
        {
            const req = new Request(
                '/api/auth/login',
                {
                    method: 'POST',
                    body: JSON.stringify({ username: username, password: password })
                });
                const resp = await fetch(req);

            if (resp.status === 200)
            {
                return true;
            }

            throw new Error("Not authenticated");
        }
        catch (err)
        {
            return false;
        }
    }
}
