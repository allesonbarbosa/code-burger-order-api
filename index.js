const express = require('express');
const uuid = require('uuid');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const orders = [];

const checkOrderId = (request, response, next) => {
    const {id} = request.params;

    const index = orders.findIndex(order => order.id === id);

    if(index <0){
        return response.status(404).json({message: "order not found!"});
    }

    request.orderIndex = index;
    request.orderId = id;

    next();

};

const checkRequest = (request, response, next) =>{
    console.log(`[${request.method}] - ${request.url}`);

    next();
};

app.post('/order', checkRequest, (request, response) => {

    const {order, clientName, price, status} = request.body;

    const newOrder = {id:uuid.v4(), order, clientName, price, status};

    orders.push(newOrder);

    return response.status(201).json(newOrder);

});

app.get('/order', checkRequest, (request, response) => {

    return response.json(orders);

});

app.put('/order/:id', checkOrderId, checkRequest, (request, response) => {
    const index = request.orderIndex;
    const id = request.orderId;
    const {order, clientName, price, status} = request.body;
    const updateOrder = {id, order, clientName, price, status};
    orders[index] = updateOrder;

    return response.json(updateOrder);

});

app.delete('/order/:id', checkOrderId, checkRequest, (request, response) => {
    const index = request.orderIndex;
    orders.splice(index,1);

    return response.json({message: "Order deleted successfully"});

});

app.get('/order/:id', checkOrderId, checkRequest, (request, response) => {
    const index = request.orderIndex;

    return response.json(orders[index]);

});

app.patch('/order/:id', checkOrderId, checkRequest, (request, response) => {
    const index = request.orderIndex;
    orders[index].status = "Pronto";

    return response.json(orders[index]);

});

app.listen(3001, () => {

    console.log('Server start on port 3001');
});

