import Router from 'next/router';
import userRequest from '../../hooks/use-request';

const ItemDetail = ({ item }) => {
    const { doRequest, errors } = userRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            itemId: item.id
        },
        onSuccess: (order) => 
            Router.push('/orders/[orderId]', `/orders/${order.id}`)
    });

    return (
        <div>
            <h1>{item.title}</h1>
            <h4>Price: {item.price}</h4>
            {errors}
            <button onClick={doRequest} className="btn btn-primary">
                Purchase
            </button>
        </div>
    );
};

ItemShow.getInitialProps = async (context, client) => {
    const { itemId } = context.query;
    const { data } = await client.get(`/api/items/${itemId}`)

    return { item: data };
};

export default ItemDetail;