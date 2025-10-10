export const environment = {
  production: true,
  defaultauth: 'fakebackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },dataTables: {
    language: {
      url: '../assets/es-mx.json'
    },
    paging: false,
    scrollCollapse: true,
    scrollY: '200px'
  },
  //* Produccion 
  // apiUrl: 'http://192.168.22.226:8080/api/',
  //* Test
  apiUrl: 'http://192.168.22.226:8081/api/',
  // apiUrl: 'http://backend.test/api/',
  //* Local
  // apiUrl: 'http://localhost:8000/api/',
  urlApiCodigoPostal: 'https://apicodigospostales.com/v1/'
};
