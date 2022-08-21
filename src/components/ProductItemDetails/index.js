// Write your code here
import {Component} from 'react'
import {BsStarFill, BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatus = {
  success: 'SUCCESS',
  failure: 'failure',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class productItemDetails extends Component {
  state = {
    selectedItem: {},
    similarProduct: [],
    quantity: 1,
    status: apiStatus.initial,
  }

  componentDidMount() {
    this.getItemDetails()
  }

  getItemDetails = async () => {
    this.setState({status: apiStatus.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const JwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        availability: data.availability,
        brand: data.brand,
        rating: data.rating,
        totalReviews: data.total_reviews,
      }
      const similarData = data.similar_products.map(each => ({
        id: each.id,
        availability: each.availability,
        brand: each.brand,
        description: each.description,
        imageUrl: each.image_url,
        price: each.price,
        rating: each.rating,
        style: each.style,
        title: each.title,
        totalReviews: each.total_reviews,
      }))

      this.setState({
        selectedItem: updateData,
        similarProduct: similarData,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  increaseQuantity = () => {
    this.setState(prev => ({quantity: prev.quantity + 1}))
  }

  decreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prev => ({quantity: prev.quantity - 1}))
    }
  }

  dataSuccess = () => {
    const {selectedItem, quantity, similarProduct} = this.state
    const {
      title,
      imageUrl,
      price,
      description,
      rating,
      availability,
      brand,
      totalReviews,
    } = selectedItem
    return (
      <>
        <Header />
        <div className="itemContainer">
          <img className="items" src={imageUrl} alt="product" />
          <div className="itemDetailsContainer">
            <h1>{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="review-ratingContainer">
              <p className="rating">
                {rating}
                <BsStarFill className="starIcon" />
              </p>
              <p className="review">{totalReviews} Reviews</p>
            </div>
            <p className="lightFont">{description}</p>
            <p className="lightFont">
              <span>Available:</span> {availability}
            </p>
            <p className="lightFont">
              <span>Brand:</span> {brand}
            </p>
            <hr className="hr-line" />
            <div className="quantityContainer">
              <button
                testid="plus"
                type="button"
                className="increase-decreaseBtn"
                onClick={this.increaseQuantity}
              >
                <BsPlusSquare />
              </button>
              <p>{quantity}</p>
              <button
                testid="minus"
                type="button"
                className="increase-decreaseBtn"
                onClick={this.decreaseQuantity}
              >
                <BsDashSquare />
              </button>
            </div>
            <button className="addToCartBtn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <ul className="similarCardContainer">
          {similarProduct.map(Each => (
            <SimilarProductItem key={Each.id} product={Each} />
          ))}
        </ul>
      </>
    )
  }

  navigateToAllProduct = () => {
    const {history} = this.props
    history.replace('/products')
  }

  failureData = () => (
    <div className="failureContainer">
      <img
        className="items"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button
        className="continueShoppingBtn"
        onClick={this.navigateToAllProduct}
        type="button"
      >
        Continue Shopping
      </button>
    </div>
  )

  loading = () => (
    <div testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  apiProgress = () => {
    const {status} = this.state

    switch (status) {
      case apiStatus.success:
        return this.dataSuccess()
      case apiStatus.failure:
        return this.failureData()
      case apiStatus.inProgress:
        return this.loading()
      default:
        return null
    }
  }

  render() {
    return <div>{this.apiProgress()}</div>
  }
}
export default productItemDetails

/*  */
