export const login = async (data) => {
    try {
        const response = await fetch('http://localhost:3000/funcionarios/login', {
            method: 'POST',
            include: 'credentials',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });      

        if (!response.ok) {
            console.error('Erro ao fazer login:', response);
        }

        // console.log('login', await response.json());

        return await response.json();
    } catch (error) {
        throw error;
    }
}