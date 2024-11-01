import { authService } from '~/services/authModel/authService';
import {sweetAlert} from '~/composables/sweetAlert';
const swal = sweetAlert();
/**
 * Define una tienda de autenticación utilizando Pinia.
 * 
 * @store auth
 * 
 * @state
 * @property {string} placeholder - Texto de prueba para Pinia.
 * @property {Array} user - Información del usuario autenticado.
 * @property {string|null} token - Token de autenticación.
 * @property {boolean} session - Estado de la sesión de usuario.
 * @property {string|null} role - Rol del usuario autenticado.
 * 
 * @actions
 * @method login - Inicia sesión del usuario.
 * @param {Object} user - Información del usuario.
 * @param {string} token - Token de autenticación.
 * 
 * @method logout - Cierra sesión del usuario.
 */
export const auth = defineStore('auth',{
    state: () =>({
        placeholder:'prueba pinia nesteado',
        user: [],
        token: null,
        session: false,
        role: null,
        online:false,
    }),
    actions:{
        async setLogin(user,token){
            try {
                this.user = user
                this.token = token
                this.session = true
                this.role = user.role
            } catch (error) {
                console.error('Error en login en el store:', error);
                throw error;
            }
            
        },
        async setLogout(){
            try {
                this.user = []
                this.token = null
                this.session = false
                this.role = null
            } catch (error) {
                console.error('Error en logout en el store:', error);
                throw error;
            }
            
        },
        async login(email, password){
            try {
                const response = await authService.login(email, password)
                if(response.success == true){
                    this.setLogin(response.data.user,response.data.token)
                    swal.showAlert('success','right',{title: response.message, text: '',confirmType: 'timer'})
                }else if(response.success == false){
                    swal.showAlert('error','Normal',{title: 'Error', text: 'Credenciales Invalidas',confirmType: 'normal'})
                }
            } catch (error) {
                console.log(error)
                swal.showAlert('error','Normal',{title: 'Error', text: 'Credenciales Invalidas',confirmType: 'normal'})
                
            }
        },
        async logout(){
            try {
                const response = await authService.logout()
                if(response == true){
                    this.setLogout()
                    swal.showAlert('success','right',{title: 'Sesión cerrada', text: '',confirmType: 'timer'})
                    nextTick(() => {
                        navigateTo('/login/loginScreen'); // Redirigir después de la actualización del DOM
                    });
                }
            } catch (error) {
                console.error('Error en logout en el store:', error);
                throw error;
            }
        },

    },
})