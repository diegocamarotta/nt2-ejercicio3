new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true
            this.saludJugador = 100
            this.saludMonstruo = 100
            this.turnos = []
           
        },
        atacar: function () {
            var daño = this.calcularHeridas(this.rangoAtaque)
            this.saludMonstruo -= daño
            
            this.registrarEvento({jugador: true,texto: 'El jugador realiza ataque por ' + daño})
            
            if (this.verificarGanador()){
                return
            }
            
            this.ataqueDelMonstruo()


        },

        ataqueEspecial: function () {
            var daño = this.calcularHeridas(this.rangoAtaqueEspecial)
            this.saludMonstruo -= daño

            this.registrarEvento({jugador: true,texto: 'El jugador realiza ataque especial por ' + daño})
            
            if (this.verificarGanador()){
                return
            }
            
            this.ataqueDelMonstruo()
        

        },

        curar: function () {
            if (this.saludJugador <= 90){
                this.saludJugador += 10
                this.registrarEvento({jugador: true,texto: 'El jugador se cura por 10'})
            } else {
                this.saludJugador = 100
                this.registrarEvento({jugador: true,texto: 'El jugador se cura por completamente'})
            }
            
            this.ataqueDelMonstruo()

        },

        registrarEvento(evento) {
            this.turnos.unshift({
                esJugador: evento.jugador,
                text: evento.texto
            })
        },
        terminarPartida: function () {
            this.registrarEvento({jugador: true,texto: 'El jugador se ha rendido'})
            this.hayUnaPartidaEnJuego = false

        },

        ataqueDelMonstruo: function () {
            var daño = this.calcularHeridas(this.rangoAtaqueDelMonstruo)
            this.saludJugador -= daño

            this.registrarEvento({jugador: false,texto: 'El monstruo realiza ataque por ' + daño})

            this.verificarGanador()
            
        },

        calcularHeridas: function (rango) {
            return parseInt((Math.random()*(rango[1]-rango[0]))+ rango[0])
            
        },
        verificarGanador: function () {
            if (this.saludMonstruo <=0){
                this.registrarEvento({jugador: true,texto: 'El jugador ha ganado!'})
                if(confirm('Ganaste! Jugar otra partida?')){
                    this.empezarPartida()
                        
                } else {
                    this.hayUnaPartidaEnJuego = false
                }
                return true
            } else if (this.saludJugador <=0) {
                this.registrarEvento({jugador: true,texto: 'El jugador ha perdido!'})
                if(confirm('Perdiste! Jugar otra partida?')){
                    this.empezarPartida()
                        
                } else {
                    this.hayUnaPartidaEnJuego = false
                }
                return true
            }
            return false;
        },

        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }

        
    }
});