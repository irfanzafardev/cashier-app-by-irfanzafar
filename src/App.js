import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import {
	ResultComponent,
	CategoryComponent,
	NavbarComponent,
	MenusComponent,
} from "./components";
import { API_URL } from "./utils/constants";
import axios from "axios";
import swal from "sweetalert";

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			menus: [],
			chosenCategory: "Makanan",
			shoppingCart: [],
		};
	}

	componentDidMount() {
		axios
			.get(API_URL + "products?category.nama=" + this.state.chosenCategory)
			.then((res) => {
				const menus = res.data;
				this.setState({ menus });
			})
			.catch((error) => {
				console.log(error);
			});

		axios
			.get(API_URL + "keranjangs")
			.then((res) => {
				const shoppingCart = res.data;
				this.setState({ shoppingCart });
			})
			.catch((error) => {
				console.log(error);
			});
	}

	componentDidUpdate(prevState) {
		if (this.state.kerangjangs !== prevState.shoppingCart) {
			axios
				.get(API_URL + "keranjangs")
				.then((res) => {
					const shoppingCart = res.data;
					this.setState({ shoppingCart });
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}

	changeCategory = (value) => {
		this.setState({
			chosenCategory: value,
			menus: [],
		});

		axios
			.get(API_URL + "products?category.nama=" + value)
			.then((res) => {
				const menus = res.data;
				this.setState({ menus });
			})
			.catch((error) => {
				console.log(error);
			});
	};

	addCart = (value) => {
		// console.log("Menu :", value);

		axios
			.get(API_URL + "keranjangs?product.id=" + value.id)
			.then((res) => {
				if (res.data.length === 0) {
					const cart = {
						jumlah: 1,
						total_harga: value.harga,
						product: value,
					};

					axios
						.post(API_URL + "keranjangs", cart)
						.then((res) => {
							swal({
								title: "Added to Cart",
								text: cart.product.nama + " has been added to cart",
								icon: "success",
								button: false,
								timer: 1500,
							});
						})
						.catch((error) => {
							console.log("Error yaa ", error);
						});
				} else {
					const cart = {
						jumlah: res.data[0].jumlah + 1,
						total_harga: res.data[0].total_harga + value.harga,
						product: value,
					};

					axios
						.put(API_URL + "keranjangs/" + res.data[0].id, cart)
						.then((res) => {
							swal({
								title: "Added to Cart",
								text: cart.product.nama + " has been added to cart",
								icon: "success",
								button: false,
								timer: 1500,
							});
						})
						.catch((error) => {
							console.log("Error yaa ", error);
						});
				}
			})
			.catch((error) => {
				console.log("Error yaa ", error);
			});
	};

	render() {
		const { menus, chosenCategory, shoppingCart } = this.state;
		return (
			<div className="App">
				<NavbarComponent />
				<div className="mt-3">
					<div className="container">
						<Row>
							<CategoryComponent
								changeCategory={this.changeCategory}
								chosenCategory={chosenCategory}
							/>
							<Col>
								<h4>Product list</h4>
								<hr></hr>
								<Row>
									{menus &&
										menus.map((menu) => (
											<MenusComponent
												key={menu.id}
												menu={menu}
												addCart={this.addCart}
											/>
										))}
								</Row>
							</Col>
							<ResultComponent shoppingCart={shoppingCart} />
						</Row>
					</div>
				</div>
			</div>
		);
	}
}
