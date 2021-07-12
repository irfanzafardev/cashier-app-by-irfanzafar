import React, { Component } from "react";
import { Col, Row, ListGroup, Badge } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";

export default class ResultComponent extends Component {
	render() {
		const { shoppingCart } = this.props;
		return (
			<Col md={3} mt="2">
				<h4>Result</h4>
				<hr />
				{shoppingCart.length !== 0 && (
					<ListGroup variant="flush">
						{shoppingCart.map((menuKeranjang) => (
							<ListGroup.Item>
								<Row>
									<Col xs="2">
										<h4>{menuKeranjang.jumlah}</h4>
									</Col>
									<Col>
										<h5>{menuKeranjang.product.nama}</h5>
										<p>Rp. {numberWithCommas(menuKeranjang.product.harga)}</p>
									</Col>
									<Col>
										<p>Rp. {numberWithCommas(menuKeranjang.total_harga)}</p>
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Col>
		);
	}
}
