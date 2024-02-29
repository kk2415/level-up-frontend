import React from "react";
import {Container, Card, Row} from 'react-bootstrap'
import {Link} from 'react-router-dom'

import {useNavigate} from 'react-router-dom'

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../css/HomeSwiper.css"
import { S3_URL } from "../api/const/BackEndHost"
import $ from "jquery";

const CardSlide = ({ channel }) => {
	const navigate = useNavigate();
	const IMG_DIR = S3_URL + channel.storeFileName

	const onMouseOver = () => {
		$('.cardImg').css('cursor', 'pointer')
	}

	const handleCardImage = () => {
		navigate(`/channel/description/` + channel.id)
	}

	return (
		<Card>
			<Row className="g-0">
				<Container>
					<Card.Img onClick={handleCardImage} onMouseOver={onMouseOver} className="cardImg"
							  variant="top" src={IMG_DIR} style={{ height: '25vh', objectFit: "fill"}} />
					<Card.Body className="card-body">
						<Link to={'/channel/description/' + channel.id}>
							<Card.Title className="card-title">
								{channel.name}
							</Card.Title>
						</Link>
						<Card.Text className="card-text"  style={ {minHeight: "10vh"} }>{channel.descriptionSummary}</Card.Text>
					</Card.Body>
					<Card.Footer className="card-footer">
						<div className="row">
							<div className="card-title col-lg-6 col-sm-12 text-lg-start text-center">
								{channel.managerName}
							</div>
						</div>

					</Card.Footer>
				</Container>
			</Row>
		</Card>
	)
}

export default CardSlide