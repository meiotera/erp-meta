import Equipe from '../Equipe/Equipe';
import Paragraph from '../Paragraph/Paragraph';
import Section from '../Section/Section';
import Map from '../Map/Map';

import styles from './Main.module.css';
import liders from '../../assets/vivianeAugusto.jpeg';
import Specialties from '../Specialties/Specialties';

function Main() {
  return (
    <>
      <Section headingH2={'Meta Saúde Integrada'}>
        {/* <HeadingH2>Meta Saúde Integrada</HeadingH2> */}
        <Paragraph>
          A Meta Saúde Integrada é uma clínica de saúde que oferece atendimento
          em diversas especialidades. Aqui você encontra profissionais
          qualificados para cuidar da sua saúde. Agende sua consulta conosco e
          venha conhecer nossa equipe.
        </Paragraph>
      </Section>
      <Section
        className="d-flex flex-wrap justify-content-around"
        headingH2="Especialidades"
      >
        <Specialties
          especialidade={'Fisioterapia'}
          icon={'bi-person-arms-up'}
        />
        <Specialties
          especialidade={'Psicologia'}
          icon={'bi-chat-square-heart'}
        />
        <Specialties
          especialidade={'Psicopedagogia'}
          icon={'bi-chat-right-heart-fill'}
        />
        <Specialties
          especialidade={'Psicanálise'}
          icon={'bi-chat-right-text'}
        />
      </Section>
      <Section
        className="d-flex justify-content-center flex-md-nowrap flex-wrap"
        headingH2="Quem somos"
      >
        <img
          className={`img border border-3 border-warning p-2 flex-fill ${styles.img}`}
          src={liders}
          alt="Viviane & Augusto"
        />
        <div className={`p-2 flex-fill ${styles.paragraphContainer}`}>
          <Paragraph className="fs-6">
            O Espaço Clínico Meta Saúde Integrada surgiu do desejo de
            desenvolver um ambiente que pudesse ser referência no acolhimento e
            acompanhamento de crianças, adolescentes, adultos e idosos que
            buscam qualidade nos serviços de saúde e educação, com foco na
            evolução e nos resultados. Foi então que em 2024, Viviane Costa e
            Augusto Negreiros, resolveram dar vida a esse sonho e inauguraram a
            tão sonhada Meta Saúde Integrada.
          </Paragraph>
          <div className="d-flex justify-content-center flex-wrap">
            <Specialties
              especialidade={'Afeto'}
              icon={'bi-balloon-heart-fill'}
            />
            <Specialties
              especialidade={'Acolhimento'}
              icon={'bi-person-hearts'}
            />
            <Specialties especialidade={'Empatia'} icon={'bi-chat-heart'} />
            <Specialties
              especialidade={'Confiança'}
              icon={'bi-shield-lock-fill'}
            />
            <Specialties especialidade={'Dedicação'} icon={'bi-award-fill'} />
            <Specialties especialidade={'Respeito'} icon={'bi-heart'} />
          </div>
        </div>
      </Section>
      <Section
        className="d-flex justify-content-around"
        headingH2="Nossa equipe"
      >
        <Equipe onClickEnabled={false} />
      </Section>
      <Section headingH2={'Faça-nos uma visita'}>
        <Map />
      </Section>
    </>
  );
}

export default Main;
