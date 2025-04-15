import React, { useEffect } from 'react';
import Section from '../components/Section/Section';
import Paragraph from '../components/Paragraph/Paragraph';
import Specialties from '../components/Specialties/Specialties';
import Equipe from '../components/Equipe/Equipe';

import styles from './Home.module.css';
import liders from '../assets/vivianeAugusto.jpeg';
import Map from '../components/Map/Map';

import useMetaTags from '../Hooks/useMetaTags';

function Home() {
  useMetaTags({
    title: 'Home | Meta Saúde Integrada',
    description:
      'A Clínica Meta Saúde Integrada oferece atendimento especializado em Fisioterapia, Psicopedagogia, Psicanálise e Terapia para crianças, adolescentes e adultos. Com uma equipe multidisciplinar dedicada ao cuidado integral da mente e do corpo, promovemos saúde, bem-estar e qualidade de vida em um ambiente acolhedor e humanizado.',
    keywords:
      'agendamento online, clínica de fisioterapia, psicopedagogia, psicanálise, terapia, Mossoró, saúde integrada, clínica, saúde, fisioterapia, dor',
    robots: 'index, follow',
  });

  // useEffect(() => {
  //   // Definir o título da página
  //   document.title = 'Agendamento';

  //   // Criar a meta tag para descrição
  //   const metaDescription = document.createElement('meta');
  //   metaDescription.name = 'description';
  //   metaDescription.content =
  //     'A Clínica Meta Saúde Integrada oferece atendimento especializado em Fisioterapia, Psicopedagogia, Psicanálise e Terapia para crianças, adolescentes e adultos. Com uma equipe multidisciplinar dedicada ao cuidado integral da mente e do corpo, promovemos saúde, bem-estar e qualidade de vida em um ambiente acolhedor e humanizado.';
  //   document.head.appendChild(metaDescription);

  //   // Criar outras meta tags (exemplo: keywords)
  //   const metaKeywords = document.createElement('meta');
  //   metaKeywords.name = 'keywords';
  //   metaKeywords.content =
  //     'agendamento online, clínica de fisioterapia, psicopedagogia, psicanálise, terapia, Mossoró, saúde integrada';
  //   document.head.appendChild(metaKeywords);

  //   // Criar a meta tag para robots
  //   const metaRobots = document.createElement('meta');
  //   metaRobots.name = 'robots';
  //   metaRobots.content = 'index, follow';
  //   document.head.appendChild(metaRobots);

  //   // Criar a meta tag para Open Graph (og:title)
  //   const metaOgTitle = document.createElement('meta');
  //   metaOgTitle.property = 'og:title';
  //   metaOgTitle.content = 'Agende sua Consulta | Meta Saúde Integrada';
  //   document.head.appendChild(metaOgTitle);

  //   // Criar a meta tag para Open Graph (og:description)
  //   const metaOgDescription = document.createElement('meta');
  //   metaOgDescription.property = 'og:description';
  //   metaOgDescription.content =
  //     'Agende sua consulta de forma rápida e segura com nossos profissionais em fisioterapia, psicanálise e mais.';
  //   document.head.appendChild(metaOgDescription);

  //   // Cleanup (remoção das tags quando o componente for desmontado)
  //   return () => {
  //     document.head.removeChild(metaDescription);
  //     document.head.removeChild(metaKeywords);
  //     document.head.removeChild(metaRobots);
  //     document.head.removeChild(metaOgTitle);
  //     document.head.removeChild(metaOgDescription);
  //   };
  // }, []);

  return (
    <>
      {/* <Header /> */}
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
      {/* <Footer /> */}
    </>
  );
}

export default Home;
