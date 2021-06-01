const app = Vue.createApp({
    data() {
        return {
            init: {
                method: "GET",
                headers: {
                    "X-API-Key" : "oPPzFipxAVAU2EDij2jWzPbSdepSthgMNbPoSfsh"
                }
            },

            // Filters
            senate : [],
            house : [],
            
            partidos: [],
            selected : "",
            states : [],

            // At a glance
            houseGlance: {
                democrats : 0,
                democratsVotes: 0,

                republicans : 0,
                republicansVotes: 0,

                independents : 0,
                independentsVotes: 0,

                total: 0,
                totalAvg: 0
            },
            senateGlance: {
                democrats : 0,
                democratsVotes: 0,

                republicans : 0,
                republicansVotes: 0,

                independents : 0,
                independentsVotes: 0,

                total: 0,
                totalAvg: 0
            },

            // Attendance
            leastEngagedH : [],
            mostEngagedH : [],

            leastEngagedS : [],
            mostEngagedS : [],

            // Loyal
            leastLoyalH : [],
            mostLoyalH : [],

            leastLoyalS : [],
            mostLoyalS : [],

            leastPorcentajeS : [],
            mostPorcentajeS : [],

            leastPorcentajeH : [],
            mostPorcentajeH : [],
        }
    },
    created() {
        fetch('https://api.propublica.org/congress/v1/113/senate/members.json', this.init)
            .then(resp => resp.json())
            .then(json => {this.senate = json.results[0].members
                this.contador(this.senate, this.senateGlance)
                this.total(this.senateGlance)

                this.engagedSenate(true)
                this.engagedSenate(false)

                this.loyaltySenate(true)
                this.loyaltySenate(false)
            })
        fetch('https://api.propublica.org/congress/v1/113/house/members.json', this.init)
            .then(resp => resp.json())
            .then(json => {
                this.house = json.results[0].members
                this.contador(this.house, this.houseGlance)
                this.total(this.houseGlance)

                this.engagedHouse(true)
                this.engagedHouse(false)

                this.loyaltyHouse(true)
                this.loyaltyHouse(false)
            })
    },
    methods : {

        // Contador de Reps y Porcentaje de votos por partido %
        contador (array, element) {

            let democratsVotesLength = []
            let republicansVotesLength = []
            let independentsVotesLength = []

            array.forEach(member => {
                if (member.party === "D") {
                    element.democrats++

                    democratsVotesLength.push(member.votes_with_party_pct)
                }
                if (member.party === "R") {
                    element.republicans++

                    republicansVotesLength.push(member.votes_with_party_pct)
                } 
                if (member.party === "ID") {
                    element.independents++

                    independentsVotesLength.push(member.votes_with_party_pct)
                }
            });

            element.democratsVotes = Math.round(democratsVotesLength.reduce((a,b) => a + b, 0) / democratsVotesLength.length)

            element.republicansVotes = Math.round(republicansVotesLength.reduce((a,b) => a + b, 0) / republicansVotesLength.length)

            element.independentsVotes = Math.round(independentsVotesLength.reduce((a,b) => a + b, 0) / independentsVotesLength.length)
        },

        // Total Reps y total porcentaje de votos
        total(element) {

            if (element.independentsVotes > 0) {
                element.totalAvg = element.democratsVotes + element.republicansVotes + element.independentsVotes
            } else {
                element.totalAvg = element.democratsVotes + element.republicansVotes
            }

            element.total = element.democrats + element.republicans + element.independents
        },

        engagedHouse (boolean) {
            let save = [...this.house]
        
            save.sort ((a,b) => {
                if (a.missed_votes < b.missed_votes) {
                    if (boolean) {
                        return -1
                    } else {
                        return 1
                    }
                }
                if (a.missed_votes > b.missed_votes) {
                    if (boolean) {
                        return 1
                    } else {
                        return -1
                    }
                }
                return 0
            })

            let numero = parseInt(this.house.length * 0.1)
            let newArray = save.slice(0, numero + 1)
            let maximo = newArray[newArray.length - 1].missed_votes

            this.house.forEach(a => {
                if (a.missed_votes === maximo) {
                    newArray.push(a)
                }
            })
            
            if (boolean) {
                this.leastEngagedH = newArray
            } else {
                this.mostEngagedH = newArray
            }
        },

        engagedSenate (boolean) {
            let save = [...this.senate]
        
            save.sort ((a,b) => {
                if (a.missed_votes < b.missed_votes) {
                    if (boolean) {
                        return -1
                    } else {
                        return 1
                    }
                }
                if (a.missed_votes > b.missed_votes) {
                    if (boolean) {
                        return 1
                    } else {
                        return -1
                    }
                }
                return 0
            })

            let numero = parseInt(this.senate.length * 0.1)
            let newArray = save.slice(0, numero + 1)
            let maximo = newArray[newArray.length - 1].missed_votes

            this.senate.forEach(a => {
                if (a.missed_votes === maximo) {
                    newArray.push(a)
                }
            })
            
            if (boolean) {
                this.leastEngagedS = newArray
            } else {
                this.mostEngagedS = newArray
            }
        },

        loyaltyHouse (boolean) {
            let save = [...this.house]
        
            save.sort ((a,b) => {
                if (a.votes_with_party_pct < b.votes_with_party_pct) {
                    if (boolean) {
                        return -1
                    } else {
                        return 1
                    }
                }
                if (a.votes_with_party_pct > b.votes_with_party_pct) {
                    if (boolean) {
                        return 1
                    } else {
                        return -1
                    }
                }
                return 0
            })

            let numero = parseInt(this.house.length * 0.1)
            let newArray = save.slice(0, numero + 1)
            let maximo = newArray[newArray.length - 1].votes_with_party_pct

            this.house.forEach(a => {
                if (a.votes_with_party_pct === maximo) {
                    newArray.push(a)
                }
                a.total_votes = Math.round((a.total_votes * a.votes_with_party_pct) / 100)
            })

            if (boolean) {
                this.leastLoyalH = newArray
            } else {
                this.mostLoyalH = newArray
            }
        },

        loyaltySenate (boolean) {
            let save = [...this.senate]
        
            save.sort ((a,b) => {
                if (a.votes_with_party_pct < b.votes_with_party_pct) {
                    if (boolean) {
                        return -1
                    } else {
                        return 1
                    }
                }
                if (a.votes_with_party_pct > b.votes_with_party_pct) {
                    if (boolean) {
                        return 1
                    } else {
                        return -1
                    }
                }
                return 0
            })

            let numero = parseInt(this.senate.length * 0.1)
            let newArray = save.slice(0, numero + 1)
            let maximo = newArray[newArray.length - 1].votes_with_party_pct

            this.senate.forEach(a => {
                if (a.votes_with_party_pct === maximo) {
                    newArray.push(a)
                }
                a.total_votes = Math.round((a.total_votes * a.votes_with_party_pct) / 100)
            })
            
            if (boolean) {
                this.leastLoyalS = newArray
            } else {
                this.mostLoyalS = newArray
            }
        },
    },
    computed: {
        filtrarMiembrosH() {
            let chequeados = this.house.filter(miembro => this.partidos.includes(miembro.party) || this.partidos.length === 0)
            if (this.selected == "") {
                return chequeados
            } else {
                let selected = this.selected.split(" ")
                let Seleccionados = [...chequeados].filter(e => e.state == selected & this.partidos.includes(e.party) || this.partidos.length === 0)
                return Seleccionados
            }
        },
        filtrarEstadosH () {
            let EstadosRepetidos = []
            this.house.map(e => EstadosRepetidos.push(e.state))
            let Estados = []
            EstadosRepetidos.sort()
            for (let i = 0; i < EstadosRepetidos.length; i++) {
                if (EstadosRepetidos[i] != EstadosRepetidos[i + 1]) {
                    Estados.push(EstadosRepetidos[i])
                }
            }
            return this.states = Estados
        },
        filtrarMiembrosS() {
            let chequeados = this.senate.filter(miembro => this.partidos.includes(miembro.party) || this.partidos.length === 0)
            if (this.selected == "") {
                return chequeados
            } else {
                let selected = this.selected.split(" ")
                let Seleccionados = [...chequeados].filter(e => e.state == selected & this.partidos.includes(e.party) || this.partidos.length === 0)
                return Seleccionados
            }
        },
        filtrarEstadosS () {
            let EstadosRepetidos = []
            this.senate.map(e => EstadosRepetidos.push(e.state))
            let Estados = []
            EstadosRepetidos.sort()
            for (let i = 0; i < EstadosRepetidos.length; i++) {
                if (EstadosRepetidos[i] != EstadosRepetidos[i + 1]) {
                    Estados.push(EstadosRepetidos[i])
                }
            }
            return this.states = Estados
        },
    }
})

app.mount("#app")