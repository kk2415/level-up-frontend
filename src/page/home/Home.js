import React from 'react';
import {Container, Row, Col} from 'react-bootstrap'
import { StudySwiper } from '../../component/HomeSwiper'
import HorizonLine from "../../component/HorizonLine";

const Home = () => {
  return (
      <>
        <Container style={{width: "80%"}}>
          <StudySwiper category={'STUDY'} />

          <br />
          <HorizonLine border={3} />

          <StudySwiper category={'PROJECT'} />
        </Container>
      </>
  )
}

export default Home