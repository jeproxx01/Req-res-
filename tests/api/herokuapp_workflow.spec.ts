import {test, expect} from '@playwright/test'



    test.describe('herokuapp API workflow with Auth ', () => {

        let token: string;
        let bookingId: number;


        test.beforeAll(async ({request}) =>{

            const response = await request.post('https://restful-booker.herokuapp.com/auth', {

                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    username: 'admin',
                    password: 'password123',
                },
            });

            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            //save token
            token = body.token;
            expect(token).toBeDefined()
            console.log(`Saved Token : ${token}`);

          });

        test('should perform CRUD Workflow', async ({request}) => {

            await test.step('Create a new Booking',async({}) => {
                const createResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        firstname: 'John',
                        lastname: 'Doe',
                        totalprice: 120,
                        depositpaid: true,
                        bookingdates: {
                            checkin: '2026-09-01',
                            checkout: '2026-09-10',
                        },
                        additionalneeds: 'Breakfast and Lunch',
                    },
                });

                expect(createResponse.status()).toBe(200);
                const body = await createResponse.json();

                bookingId = body.bookingid;
                expect(bookingId).toBeDefined();
                expect(body.booking.firstname).toBe('John');
                console.log(`Created Booking ID: ${bookingId}`);
            });

            await test.step('Retrived the created booking', async () => {
                const getResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);

                expect(getResponse.status()).toBe(200);
                const body = await getResponse.json();
                expect(body.firstname).toBe('John');
                expect(body.lastname).toBe('Doe');
                console.log(body);
            });

            await test.step('Update Booking Details', async () =>{

                const updateResponse = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept':'application/json',
                        //Pass the Auth Token inside the Cookie header
                        'Cookie': `token=${token}`,
                    },

                    data: {
                        firstname: 'Jane', //changing name to Jane
                        lastname: 'Doe',
                        totalprice: 150, //changing price to 150
                        depositpaid: true,
                        bookingdates: {
                            checkin: '2026-09-01',
                            checkout: '2026-09-10',
                        },
                        additionalneeds: 'Breakfast and Lunch',
                    },
                });

                expect(updateResponse.status()).toBe(200);
                const body = await updateResponse.json();
                expect(body.firstname).toBe('Jane');
                expect(body.totalprice).toBe(150);


            });
            


        });

          

    });

  