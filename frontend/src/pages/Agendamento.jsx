import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Section from "../components/Section/Section";
import SectionMain from "../components/SectionMain/SectionMain";
import FormAgendamento from "../components/FormAgendamento/FormAgendamento";
import Equipe from "../components/Equipe/Equipe";
import Loading from "../components/Loading/Loading";
import Message from '../components/Message/Message';
import Modal from '../components/Modal/Modal';
import { UsersContext } from "../Contexts/UsersContext";

function Agendamento() {
    const { loading, agenda, message } = useContext(UsersContext);
    const [localMessage, setLocalMessage] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const [diasDisponiveis, setDiasDisponiveis] = useState([]);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

    useEffect(() => {
        if (message) {
            setLocalMessage({ type: message.status, text: message.text });
        } else {
            setLocalMessage(null);
        }

        // Filtrar dias com horários disponíveis
        const diasComHorarios = agenda.filter(item => item.horariosDisponiveis.some(h => h.disponivel));
        setDiasDisponiveis(diasComHorarios);

        // Extrai os horários disponíveis
        const horarios = diasComHorarios.map(item => item.horariosDisponiveis.filter(h => h.disponivel));
        setHorariosDisponiveis(horarios);

        // Verifica se há dias disponíveis e abre a modal
        if (diasComHorarios.length > 0) {
            abrirModal();
        } else {
            fecharModal();
        }

    }, [agenda, message, loading]);

     // Reseta os estados quando o usuário muda de página
    useEffect(() => {
        setLocalMessage(null);
        fecharModal();
    }, [location.pathname]);

    // Função que abre a modal
    function abrirModal() {
        setIsOpen(true);
    }

    // Função que fecha a modal
    function fecharModal() {
        setIsOpen(false);
        setDiasDisponiveis([]);
        setHorariosDisponiveis([]);
    }



    return (
        <SectionMain>
            <Message type={'alert-warning'} text={'Selecione um especialista para ver a agenda'} />
            <Section headingH2={'Selecione o especialista'}>
                <Equipe onClickEnabled={true} />
            </Section>

            {diasDisponiveis.length > 0 ? (
                <Section>
                    {loading ? <Loading /> :
                        <>
                            <Modal
                                isOpen={modalIsOpen}
                                onClose={fecharModal}
                                contentLabel="Modal de exemplo"
                            >
                                <FormAgendamento diasDisponiveis={diasDisponiveis} horarios={horariosDisponiveis} fecharModal={fecharModal} funcionarioId={agenda.id} nome={agenda.nome} />
                            </Modal>
                        </>
                    }
                </Section>
            ) :
                localMessage && <Message type={`alert-danger`} text={localMessage.text} />
            }
        </SectionMain>
    );
}

export default Agendamento;