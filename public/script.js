document.addEventListener('DOMContentLoaded', function() {
    // Определяем текущую страницу
    const path = window.location.pathname;

    // Загружаем данные в зависимости от текущей страницы
    if (path.endsWith('/clients') || path.endsWith('/clients.html')) {
        loadClients();
        const form = document.querySelector('#addClientForm');
        if (form) {
            form.addEventListener('submit', (e) => handleFormSubmit(e, '/api/clients', loadClients));
        }
    } else if (path.endsWith('/companies') || path.endsWith('/companies.html')) {
        loadCompanies();
        const form = document.querySelector('#addCompanyForm');
        if (form) {
            form.addEventListener('submit', (e) => handleFormSubmit(e, '/api/companies', loadCompanies));
        }

        // Добавляем обработчик формы редактирования только если мы на странице компаний
        const editForm = document.getElementById('editCompanyForm');
        if (editForm) {
            editForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleEditCompanyForm(e.target);
            });
        }
    } else if (path.endsWith('/rooms') || path.endsWith('/rooms.html')) {
        loadRooms();
        const form = document.querySelector('#addRoomForm');
        if (form) {
            form.addEventListener('submit', (e) => handleFormSubmit(e, '/api/rooms', loadRooms));
        }
    } else if (path.endsWith('/bookings') || path.endsWith('/bookings.html')) {
        loadBookings();
        const form = document.querySelector('#addBookingForm');
        if (form) {
            form.addEventListener('submit', (e) => handleFormSubmit(e, '/api/bookings', loadBookings));
        }
    } else if (path.endsWith('/payments') || path.endsWith('/payments.html')) {
        loadPayments();
        const form = document.querySelector('#addPaymentForm');
        if (form) {
            form.addEventListener('submit', (e) => handleFormSubmit(e, '/api/payments', loadPayments));
        }
    }

    // Инициализация модального окна визитов
    const visitModal = document.getElementById('visitModal');
    if (visitModal) {
        const closeModal = visitModal.querySelector('.close');
        if (closeModal) {
            closeModal.onclick = function() {
                visitModal.style.display = 'none';
            }
        }

        const addVisitForm = document.getElementById('addVisitForm');
        if (addVisitForm) {
            addVisitForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleAddVisitForm(e.target);
            });
        }
    }
});
// Функция для обработки формы редактирования компании
function handleEditCompanyForm(form) {
    const companyId = document.getElementById('editCompanyId').value;
    const formData = new FormData(form);

    const companyData = {
        name: formData.get('name'),
        type: formData.get('type'),
        contract: {
            start: formData.get('contract.start'),
            end: formData.get('contract.end'),
            discount_percent: Number(formData.get('contract.discount_percent')) || 0,
            special_conditions: formData.get('contract.special_conditions')
        }
    };

    fetch(`/api/companies/${companyId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            loadCompanies();
            closeEditModal();
            alert('Данные компании успешно обновлены!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при обновлении данных компании: ' + error.message);
        });
}

// Функция для обработки формы добавления визита
function handleAddVisitForm(form) {
    const clientId = document.getElementById('clientIdForVisit').value;
    const formData = new FormData(form);
    const visitData = Object.fromEntries(formData.entries());

    // Преобразование дат и числовых полей
    visitData.start_date = new Date(visitData.start_date);
    visitData.end_date = new Date(visitData.end_date);
    if (visitData.total_due) visitData.total_due = Number(visitData.total_due);
    if (visitData.services_used) visitData.services_used = visitData.services_used.split(',');
    if (visitData.complaints) visitData.complaints = visitData.complaints.split(',');

    fetch(`/api/clients/${clientId}/visits`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
    })
        .then(response => response.json())
        .then(() => {
            loadClients();
            const visitModal = document.getElementById('visitModal');
            if (visitModal) visitModal.style.display = 'none';
            form.reset();
            alert('Визит успешно добавлен!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении визита');
        });
}

// Добавить в script.js
function openEditClientModal(clientId) {
    fetch(`/api/clients/${clientId}`)
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${errorText}`);
            }
            return response.json();
        })
        .then(client => {
            // Заполняем основную информацию о клиенте
            document.getElementById('editClientId').value = client._id;
            document.getElementById('editFullName').value = client.full_name;
            document.getElementById('editPassportNumber').value = client.passport_number;
            document.getElementById('editPhone').value = client.contacts.phone;
            document.getElementById('editEmail').value = client.contacts.email || '';

            // Заполняем таблицу визитов
            const visitsTable = document.querySelector('#editClientVisitsTable tbody');
            visitsTable.innerHTML = '';

            if (client.visits && client.visits.length > 0) {
                client.visits.forEach(visit => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${visit.room_number}</td>
                        <td>${visit.building_name}</td>
                        <td>${formatDate(visit.start_date)} - ${formatDate(visit.end_date)}</td>
                        <td>${visit.services_used ? visit.services_used.join(', ') : '-'}</td>
                        <td>${visit.total_due || 0} руб.</td>
                        <td>
                            <button onclick="deleteClientVisit('${client._id}', '${visit._id}')" class="btn btn-danger">Удалить</button>
                        </td>
                    `;
                    visitsTable.appendChild(row);
                });
            } else {
                visitsTable.innerHTML = '<tr><td colspan="6">Нет визитов</td></tr>';
            }

            // Показываем модальное окно
            document.getElementById('editClientModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Ошибка загрузки данных клиента:', error);
            alert('Произошла ошибка при загрузке данных клиента');
        });
}

function closeEditClientModal() {
    document.getElementById('editClientModal').style.display = 'none';
}

function deleteClientVisit(clientId, visitId) {
    if (!confirm('Вы уверены, что хотите удалить этот визит?')) return;

    fetch(`/api/clients/${clientId}/visits/${visitId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            // Перезагружаем данные клиента
            openEditClientModal(clientId);
            alert('Визит успешно удален');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при удалении визита: ' + error.message);
        });
}

// Обработчик формы редактирования клиента
document.getElementById('editClientForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const clientId = document.getElementById('editClientId').value;
    const formData = new FormData(e.target);

    const clientData = {
        full_name: formData.get('full_name'),
        passport_number: formData.get('passport_number'),
        contacts: {
            phone: formData.get('phone'),
            email: formData.get('email')
        }
    };

    fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            loadClients();
            closeEditClientModal();
            alert('Данные клиента успешно обновлены!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при обновлении данных клиента: ' + error.message);
        });
});

// Обработчик формы добавления визита (в модальном окне редактирования)
document.getElementById('addClientVisitForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const clientId = document.getElementById('editClientId').value;
    const formData = new FormData(e.target);
    const visitData = Object.fromEntries(formData.entries());

    // Преобразование данных визита
    visitData.start_date = new Date(visitData.start_date);
    visitData.end_date = new Date(visitData.end_date);
    if (visitData.total_due) visitData.total_due = Number(visitData.total_due);
    if (visitData.services_used) visitData.services_used = visitData.services_used.split(',').map(s => s.trim());
    if (visitData.complaints) visitData.complaints = visitData.complaints.split(',').map(s => s.trim());

    fetch(`/api/clients/${clientId}/visits`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            // Перезагружаем данные клиента
            openEditClientModal(clientId);
            e.target.reset();
            alert('Визит успешно добавлен!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении визита: ' + error.message);
        });
});

// Обновим функцию loadClients, чтобы добавить кнопку редактирования
function loadClients() {
    fetch('/api/clients')
        .then(response => response.json())
        .then(clients => {
            const tbody = document.querySelector('#clientsTable tbody');
            tbody.innerHTML = '';

            clients.forEach(client => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${client.full_name}</td>
                    <td>${client.passport_number}</td>
                    <td>${client.contacts.phone}</td>
                    <td>${client.contacts.email || '-'}</td>
                    <td>${client.visits ? client.visits.length : 0}</td>
                    <td class="action-buttons">
                        <button onclick="openEditClientModal('${client._id}')" class="btn btn-primary">Редактировать</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Ошибка загрузки клиентов:', error));
}

function loadCompanies() {
    fetch('/api/companies')
        .then(response => response.json())
        .then(companies => {
            const tbody = document.querySelector('#companiesTable tbody');
            tbody.innerHTML = '';

            companies.forEach(company => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${company.name}</td>
                    <td>${company.type}</td>
                    <td>${company.contract.special_conditions}</td>
                    <td>${company.contract.discount_percent}%</td>
                    <td>${company.booking_ids ? company.booking_ids.length : 0}</td>
                    <td class="action-buttons">
                        <button onclick="openEditCompanyModal('${company._id}')" class="btn btn-primary">Редактировать</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Ошибка загрузки компаний:', error));
}

function loadRooms() {
    fetch('/api/rooms')
        .then(response => response.json())
        .then(rooms => {
            const tbody = document.querySelector('#roomsTable tbody');
            tbody.innerHTML = '';

            rooms.forEach(room => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${room.number}</td>
                    <td>${room.building.name} (${room.building.stars}★)</td>
                    <td>${room.floor}</td>
                    <td>${room.capacity}</td>
                    <td>${room.status}</td>
                    <td>${room.price_per_night} руб.</td>
                    <td>${room.amenities ? room.amenities.join(', ') : 'нет'}</td>
                    <td>${room.building.amenities ? room.building.amenities.join(', ') : 'нет'}</td>
                    <td>${room.next_booking_date ? formatDate(room.next_booking_date) : 'нет'}</td>
                    <td class="action-buttons">
                        <button onclick="openEditRoomModal('${room._id}')" class="btn btn-primary">Редактировать</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Ошибка загрузки номеров:', error));
}
// Функция для открытия модального окна редактирования номера
function openEditRoomModal(roomId) {
    fetch(`/api/rooms/${roomId}`)
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${errorText}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                throw new TypeError('Сервер вернул не JSON!');
            }
            return response.json();
        })
        .then(room => {
            document.getElementById('editRoomId').value = room._id;
            document.getElementById('editRoomNumber').value = room.number;
            document.getElementById('editRoomFloor').value = room.floor;
            document.getElementById('editRoomCapacity').value = room.capacity;
            document.getElementById('editRoomStatus').value = room.status;
            document.getElementById('editRoomPrice').value = room.price_per_night;
            document.getElementById('editRoomAmenities').value = room.amenities ? room.amenities.join(', ') : '';
            document.getElementById('editRoomBuildingName').value = room.building.name;
            document.getElementById('editRoomBuildingStars').value = room.building.stars;
            document.getElementById('editRoomBuildingAmenities').value = room.building.amenities ? room.building.amenities.join(', ') : '';

            document.getElementById('editRoomModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Ошибка загрузки данных номера:', error);
            alert('Произошла ошибка при загрузке данных номера. Подробности в консоли.');
        });
}
// Функция для закрытия модального окна редактирования номера
function closeEditRoomModal() {
    document.getElementById('editRoomModal').style.display = 'none';
}

// Обработчик формы редактирования номера
document.getElementById('editRoomForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const roomId = document.getElementById('editRoomId').value;
    const formData = new FormData(e.target);

    // Create properly structured room data
    const roomData = {
        number: formData.get('number'),
        floor: Number(formData.get('floor')),
        capacity: Number(formData.get('capacity')),
        status: formData.get('status'),
        price_per_night: Number(formData.get('price_per_night')),
        amenities: formData.get('amenities')
            ? formData.get('amenities').split(',').map(item => item.trim())
            : [],
        building: {
            name: formData.get('building.name'),
            stars: Number(formData.get('building.stars')),
            amenities: formData.get('building.amenities')
                ? formData.get('building.amenities').split(',').map(item => item.trim())
                : []
        }
    };

    fetch(`/api/rooms/${roomId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            loadRooms();
            closeEditRoomModal();
            alert('Данные номера успешно обновлены!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при обновлении данных номера: ' + error.message);
        });
});
// Добавить в script.js
function openEditBookingModal(bookingId) {
    fetch(`/api/bookings/${bookingId}`)
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${errorText}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                throw new TypeError('Сервер вернул не JSON!');
            }
            return response.json();
        })
        .then(booking => {
            document.getElementById('editBookingId').value = booking._id;
            document.getElementById('editBookingCompanyId').value = booking.company_id?._id || '';
            document.getElementById('editBookingHotelClass').value = booking.hotel_class;
            document.getElementById('editBookingFloor').value = booking.floor;
            document.getElementById('editBookingRoomsReserved').value = booking.rooms_reserved;
            document.getElementById('editBookingPeopleCount').value = booking.people_count;
            document.getElementById('editBookingStartDate').value = booking.start_date?.split('T')[0] || '';
            document.getElementById('editBookingEndDate').value = booking.end_date?.split('T')[0] || '';
            document.getElementById('editBookingRoomsNumbers').value = booking.rooms_numbers ? booking.rooms_numbers.join(', ') : '';
            document.getElementById('editBookingCanceled').value = booking.canceled ? 'true' : 'false';

            document.getElementById('editBookingModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Ошибка загрузки данных бронирования:', error);
            alert('Произошла ошибка при загрузке данных бронирования. Подробности в консоли.');
        });
}

function closeEditBookingModal() {
    document.getElementById('editBookingModal').style.display = 'none';
}

// Обработчик формы редактирования бронирования
document.getElementById('editBookingForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const bookingId = document.getElementById('editBookingId').value;
    const formData = new FormData(e.target);

    const bookingData = {
        company_id: formData.get('company_id') || null,
        hotel_class: Number(formData.get('hotel_class')),
        floor: Number(formData.get('floor')),
        rooms_reserved: Number(formData.get('rooms_reserved')),
        people_count: Number(formData.get('people_count')),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        canceled: formData.get('canceled') === 'true',
        rooms_numbers: formData.get('rooms_numbers')
            ? formData.get('rooms_numbers').split(',').map(item => item.trim())
            : []
    };

    fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            loadBookings();
            closeEditBookingModal();
            alert('Данные бронирования успешно обновлены!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при обновлении данных бронирования: ' + error.message);
        });
});

// Обновим функцию loadBookings, чтобы добавить кнопку редактирования
function loadBookings() {
    fetch('/api/bookings')
        .then(response => response.json())
        .then(bookings => {
            const tbody = document.querySelector('#bookingsTable tbody');
            tbody.innerHTML = '';

            bookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.company_id ? booking.company_id.name : 'Без компании'}</td>
                    <td>${booking.hotel_class} звезды</td>
                    <td>${booking.floor}</td>
                    <td>${booking.rooms_reserved}</td>
                    <td>${booking.people_count}</td>
                    <td>${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}</td>
                    <td>${booking.rooms_numbers ? booking.rooms_numbers.join(', ') : 'не указаны'}</td>
                    <td>${booking.canceled ? 'Отменено' : 'Активно'}</td>
                    <td class="action-buttons">
                        <button onclick="openEditBookingModal('${booking._id}')" class="btn btn-primary">Редактировать</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Ошибка загрузки бронирований:', error));
}

// Добавить в script.js
function openEditPaymentModal(paymentId) {
    fetch(`/api/payments/${paymentId}`)
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${errorText}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                throw new TypeError('Сервер вернул не JSON!');
            }
            return response.json();
        })
        .then(payment => {
            document.getElementById('editPaymentId').value = payment._id;
            document.getElementById('editPaymentClientId').value = payment.client_id?._id || '';
            document.getElementById('editPaymentDate').value = payment.date?.split('T')[0] || '';
            document.getElementById('editPaymentAmount').value = payment.amount;
            document.getElementById('editPaymentDescription').value = payment.description ? payment.description.join(', ') : '';

            document.getElementById('editPaymentModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Ошибка загрузки данных платежа:', error);
            alert('Произошла ошибка при загрузке данных платежа. Подробности в консоли.');
        });
}

function closeEditPaymentModal() {
    document.getElementById('editPaymentModal').style.display = 'none';
}

// Обработчик формы редактирования платежа
document.getElementById('editPaymentForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const paymentId = document.getElementById('editPaymentId').value;
    const formData = new FormData(e.target);

    const paymentData = {
        client_id: formData.get('client_id'),
        date: formData.get('date'),
        amount: Number(formData.get('amount')),
        description: formData.get('description')
            ? formData.get('description').split(',').map(item => item.trim())
            : []
    };

    fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            loadPayments();
            closeEditPaymentModal();
            alert('Данные платежа успешно обновлены!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при обновлении данных платежа: ' + error.message);
        });
});

function loadPayments() {
    fetch('/api/payments')
        .then(response => response.json())
        .then(payments => {
            const tbody = document.querySelector('#paymentsTable tbody');
            tbody.innerHTML = '';

            payments.forEach(payment => {
                const row = document.createElement('tr');
                const clientName = payment.client_id?.full_name || 'Не указан';
                const descriptionText = payment.description
                    ? payment.description.join(', ')
                    : 'Нет описания';

                row.innerHTML = `
                    <td>${clientName}</td>
                    <td>${formatDate(payment.date)}</td>
                    <td>${payment.amount} руб.</td>
                    <td>${descriptionText}</td>
                    <td class="action-buttons">
                        <button onclick="openEditPaymentModal('${payment._id}')" class="btn btn-primary">Редактировать</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Ошибка загрузки платежей:', error));
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}
function handleFormSubmit(event, endpoint, loadFunction) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Преобразуем числовые поля и булевы значения
    Object.keys(data).forEach(key => {
        if (!isNaN(data[key]) && data[key] !== '') {
            data[key] = Number(data[key]);
        } else if (data[key] === 'true') {
            data[key] = true;
        } else if (data[key] === 'false') {
            data[key] = false;
        }
    });

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            loadFunction();
            form.reset();
            // Скрываем форму после успешного добавления
            const formContainer = form.closest('.add-form');
            if (formContainer) {
                formContainer.style.display = 'none';
                const showBtn = document.querySelector('.show-form-btn');
                if (showBtn) showBtn.style.display = 'block';
            }
            alert('Данные успешно добавлены!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении данных: ' + error.message);
        });
}

// Модальное окно для визитов
const visitModal = document.getElementById('visitModal');
const closeModal = document.querySelector('.close');
const addVisitForm = document.getElementById('addVisitForm');

// Открытие модального окна для добавления визита
function openAddVisitModal(clientId) {
    document.getElementById('clientIdForVisit').value = clientId;
    visitModal.style.display = 'block';
}

// Закрытие модального окна
closeModal.onclick = function() {
    visitModal.style.display = 'none';
}

// Закрытие при клике вне модального окна
window.onclick = function(event) {
    if (event.target == visitModal) {
        visitModal.style.display = 'none';
    }
}

// Обработка добавления визита
addVisitForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const clientId = document.getElementById('clientIdForVisit').value;
    const formData = new FormData(addVisitForm);
    const visitData = Object.fromEntries(formData.entries());

    // Преобразование дат и числовых полей
    visitData.start_date = new Date(visitData.start_date);
    visitData.end_date = new Date(visitData.end_date);
    if (visitData.total_due) visitData.total_due = Number(visitData.total_due);
    if (visitData.services_used) visitData.services_used = visitData.services_used.split(',');
    if (visitData.complaints) visitData.complaints = visitData.complaints.split(',');

    fetch(`/api/clients/${clientId}/visits`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
    })
        .then(response => response.json())
        .then(() => {
            loadClients();
            visitModal.style.display = 'none';
            addVisitForm.reset();
            alert('Визит успешно добавлен!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при добавлении визита');
        });
});

// Добавить в script.js
function openEditCompanyModal(companyId) {
    fetch(`/api/companies/${companyId}`)
        .then(async response => {
            // Если ответ не OK (статус не 200-299), читаем текст ошибки
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера: ${errorText}`);
            }
            // Проверяем, что ответ — JSON
            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                throw new TypeError('Сервер вернул не JSON!');
            }
            return response.json();
        })
        .then(company => {
            // Заполняем форму данными компании
            document.getElementById('editCompanyId').value = company._id;
            document.getElementById('editCompanyName').value = company.name;
            document.getElementById('editCompanyType').value = company.type;
            document.getElementById('editContractStart').value = company.contract.start?.split('T')[0] || '';
            document.getElementById('editContractEnd').value = company.contract.end?.split('T')[0] || '';
            document.getElementById('editDiscountPercent').value = company.contract.discount_percent || '';
            document.getElementById('editSpecialConditions').value = company.contract.special_conditions || '';
            // Показываем модальное окно
            document.getElementById('editCompanyModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Ошибка загрузки данных компании:', error);
            alert('Произошла ошибка при загрузке данных компании. Подробности в консоли.');
        });
}

function closeEditModal() {
    document.getElementById('editCompanyModal').style.display = 'none';
}


// Замените текущий обработчик формы редактирования на этот
document.getElementById('editCompanyForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const companyId = document.getElementById('editCompanyId').value;
    const formData = new FormData(e.target);

    // Создаем правильную структуру данных для компании
    const companyData = {
        name: formData.get('name'),
        type: formData.get('type'),
        contract: {
            start: formData.get('contract.start'),
            end: formData.get('contract.end'),
            discount_percent: Number(formData.get('contract.discount_percent')) || 0,
            special_conditions: formData.get('contract.special_conditions')
        }
    };

    fetch(`/api/companies/${companyId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            loadCompanies();
            closeEditModal();
            alert('Данные компании успешно обновлены!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при обновлении данных компании: ' + error.message);
        });
});
