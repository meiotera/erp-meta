import React, { createContext, useEffect, useState } from 'react';
import Header from "../components/Header/Header";
import Main from "../components/Main/Main";
import Footer from '../components/Footer/Footer';
import { listarFuncionarios } from '../../api/funcionario';

export const UsersContext = createContext();

function Home() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const data = await listarFuncionarios();
                setFuncionarios(data.funcionarios);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar funcionários:', error);
            }
        };

        fetchFuncionarios();
    }, []);

    return (
        <UsersContext.Provider value={{ funcionarios, setFuncionarios, loading, setLoading }}>
            <>
                {/* <Header /> */}
                <Main />
                <Footer />
            </>
        </UsersContext.Provider>
    );
}

export default Home;