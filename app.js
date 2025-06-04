const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/hotel_system')
    .then(() => console.log('MongoDB подключена'))
    .catch(err => console.error('Ошибка подключения к MongoDB:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Подключение моделей
const Client = require('./models/client');
const Company = require('./models/company');
const Room = require('./models/room');
const Booking = require('./models/booking');
const Payment = require('./models/payment');

// API endpoints для получения данных
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

// Добавленный эндпоинт для получения конкретного клиента
app.get('/api/clients/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).send('Клиент не найден');
        }
        res.json(client);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

// Добавленный эндпоинт для добавления визита клиенту
app.post('/api/clients/:id/visits', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).send('Клиент не найден');
        }

        client.visits.push(req.body);
        await client.save();

        res.status(201).json(client);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при добавлении визита');
    }
});

app.get('/api/companies', async (req, res) => {
    try {
        const companies = await Company.find().populate('booking_ids');
        res.json(companies);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('company_id');
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/api/payments', async (req, res) => {
    try {
        const payments = await Payment.find().populate('client_id');
        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

// API endpoints для создания данных
app.post('/api/clients', async (req, res) => {
    try {
        const newClient = new Client(req.body);
        await newClient.save();
        res.status(201).json(newClient);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при создании клиента');
    }
});

app.post('/api/companies', async (req, res) => {
    try {
        const newCompany = new Company(req.body);
        await newCompany.save();
        res.status(201).json(newCompany);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при создании компании');
    }
});

app.post('/api/rooms', async (req, res) => {
    try {
        const newRoom = new Room(req.body);
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при создании номера');
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();

        if (req.body.company_id) {
            await Company.findByIdAndUpdate(
                req.body.company_id,
                { $push: { booking_ids: newBooking._id } }
            );
        }

        res.status(201).json(newBooking);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при создании бронирования');
    }
});

app.post('/api/payments', async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при создании платежа');
    }
});

// В app.js добавьте этот эндпоинт (убедитесь, что он не дублируется)
app.patch('/api/companies/:id', async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedCompany) {
            return res.status(404).send('Компания не найдена');
        }
        res.json(updatedCompany);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при обновлении компании');
    }
});

app.get('/api/companies/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).send('Компания не найдена');
        }
        res.json(company);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

// Добавить в app.js
app.patch('/api/rooms/:id', async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedRoom) {
            return res.status(404).send('Номер не найден');
        }
        res.json(updatedRoom);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при обновлении номера');
    }
});

app.get('/api/rooms/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).send('Номер не найден');
        }
        res.json(room);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});
// В app.js (убедитесь, что этот эндпоинт существует)
app.patch('/api/bookings/:id', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('company_id');

        if (!updatedBooking) {
            return res.status(404).send('Бронирование не найдено');
        }
        res.json(updatedBooking);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при обновлении бронирования');
    }
});

// И эндпоинт для получения конкретного бронирования
app.get('/api/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('company_id');
        if (!booking) {
            return res.status(404).send('Бронирование не найдено');
        }
        res.json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

// В app.js добавить если их нет
app.patch('/api/payments/:id', async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('client_id');

        if (!updatedPayment) {
            return res.status(404).send('Платеж не найден');
        }
        res.json(updatedPayment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при обновлении платежа');
    }
});

app.get('/api/payments/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('client_id');
        if (!payment) {
            return res.status(404).send('Платеж не найден');
        }
        res.json(payment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});
// В app.js добавить эти эндпоинты если их нет
app.patch('/api/clients/:id', async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedClient) {
            return res.status(404).send('Клиент не найден');
        }
        res.json(updatedClient);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при обновлении клиента');
    }
});

app.delete('/api/clients/:clientId/visits/:visitId', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId);
        if (!client) {
            return res.status(404).send('Клиент не найден');
        }

        client.visits.pull({ _id: req.params.visitId });
        await client.save();

        res.json(client);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при удалении визита');
    }
});
// Маршруты для HTML страниц
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/clients', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'clients.html'));
});

app.get('/companies', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'companies.html'));
});

app.get('/rooms', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'rooms.html'));
});

app.get('/bookings', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'bookings.html'));
});

app.get('/payments', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'payments.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен  http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});