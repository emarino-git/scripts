import { useState } from 'react'

export default function FormNokiaSar() {
  const [datos, setDatos] = useState({
    sitio: '',
    hostname: '',
    ipAddress1: '',
    ipAddress2: '',
    ipAddress3: '',
    ipAddress4: '',
    selMask: '',
    staticRoute: '',
    ipSystem: ''
})

console.log(datos.selMask)

let ipGW = ''

if (datos.selMask === '24' ) {ipGW=254} 
else if (datos.ipAddress4<126) {ipGW=126}
else {ipGW=254} 


const handleInputChange = (event) => {
  setDatos({
      ...datos,
      [event.target.name] : event.target.value
  })
}



  const [nuevoNokiaIsChecked, setNuevoNokiaIsChecked] = useState(false);
  const nuevoNokia = () => {
    setNuevoNokiaIsChecked(!nuevoNokiaIsChecked);
  };

  const [qosNokiaIsChecked, setQosNokiaIsChecked] = useState(false);
  const QosNokia = () => {
    setQosNokiaIsChecked(!qosNokiaIsChecked);
  };

  const [puntoAPuntoIsChecked, setPuntoAPuntoIsChecked] = useState(false);
  const puntoAPunto = () => {
    setPuntoAPuntoIsChecked(!puntoAPuntoIsChecked);
  };

  const [sDPIsChecked, setsDPIsChecked] = useState(false);
  const sDP = () => {
    setsDPIsChecked(!sDPIsChecked);
  };
  
const saveFile = (event) => {
  event.preventDefault()
  const sitio = datos.sitio
  const hostname = datos.hostname
  const ipAddress1 = datos.ipAddress1
  const ipAddress2 = datos.ipAddress2
  const ipAddress3 = datos.ipAddress3
  const ipAddress4 = datos.ipAddress4
  const mask = datos.selMask
  const staticRoute = datos.staticRoute
  const ipGateway = ipGW
  const ipSystem = datos.ipSystem

  if(nuevoNokiaIsChecked) {


    let scriptNuevoNokia = 
`
system 
contact "Telecomunicaciones"
location "${sitio} - Sala de Comunicaciones"
time
ntp
server 192.168.111.124
server 192.168.142.60 prefer
no shutdown
exit
zone ADT -03
exit
exit

system
security
profile "Ingenieria"
default-action permit-all
entry 1
match "configure"
action permit
exit
entry 2
match "show"
action permit
exit
exit
profile "Mantenimiento"
default-action deny-all
entry 1
match "show"
action permit
exit
entry 2
match "info"
action permit
exit
entry 3
match "exit"
action permit
exit
entry 4
match "back"
action permit
exit
entry 5
match "admin display-config"
action permit
exit
exit
password
no health-check
exit

user "admin"
password "$2y$10$m4hb9RF5xEclZ/.Sj0S6M.INwSlRz4PMqgO/AJD/Wh6jRhCUh0rgi"
access console ftp snmp 
console
member "administrative"
exit
exit
exit

login-control
idle-timeout 60
exit
exit

router
ospf
asbr
traffic-engineering
area 0.0.0.0
interface "system"
no shutdown
exit
exit
exit

mpls
resignal-timer 30
cspf-on-loose-hop
interface "system"
no shutdown
exit
exit

rsvp
interface "system"
no shutdown
exit
exit

mpls
path "IGP"
no shutdown
exit
no shutdown
exit

ldp
interface-parameters
exit
targeted-session
exit
no shutdown
exit
exit

#--------------------------------------------------

configure system name ${hostname}

configure bof

address          ${ipAddress1}.${ipAddress2}.${ipAddress3}.${ipAddress4}/${mask} active
static-route     ${staticRoute} next-hop ${ipAddress1}.${ipAddress2}.${ipAddress3}.${ipGateway}
static-route     ${staticRoute} next-hop ${ipAddress1}.${ipAddress2}.${ipAddress3}.${ipGateway}
static-route     ${staticRoute} next-hop ${ipAddress1}.${ipAddress2}.${ipAddress3}.${ipGateway}

persist one

exit

3) Configuracion de Placas y MDA

configure card 1
card-type "iom-sar"
no shutdown
exit

configure card 1 mda 1
mda-type a8-1gb-sfp
no shutdown
exit

4) Configurar System Interface

configure router interface "system" address 10.77.181.${ipSystem}/32
configure router interface "system" no shutdown

`

// Convert the text to BLOB.
const textToBLOB = new Blob([scriptNuevoNokia], { type: 'text/plain' });
const sFileName = `Script Nokia ${sitio} inicial.txt`;	   // The file to save the data.

let newLink = document.createElement("a");
newLink.download = sFileName;

if (window.webkitURL != null) {
    newLink.href = window.webkitURL.createObjectURL(textToBLOB);
}
else {
    newLink.href = window.URL.createObjectURL(textToBLOB);
    newLink.style.display = "none";
    document.body.appendChild(newLink);
}

newLink.click(); 

} else if (qosNokiaIsChecked) {
  let scriptQos = 
`
config
qos

fabric-profile 7 aggregate-mode create                            
description "2,5 gb Backplane"
aggregate-rate 2500000 unshaped-sap-cir 0
exit

fabric-profile 8 aggregate-mode create			
description "1 gb Backplane"
aggregate-rate 1000000 unshaped-sap-cir 0
exit
exit

7 aplicado a las placas a8-1gb-sfp
8 aplicado a las placas a8-ethv2



-------------------------------------------------
	
card 1

mda 1
mda-type a8-1gb-sfp
network
ingress
fabric-policy 7
exit
exit
access
ingress
fabric-policy 7
exit
exit
no shutdown
exit

mda 2
mda-type a8-ethv2
network
ingress
fabric-policy 8
exit
exit
access
ingress
fabric-policy 8
exit
exit
no shutdown
exit
`
// Convert the text to BLOB.
const textToBLOB = new Blob([scriptQos], { type: 'text/plain' });
const sFileName = `QoS fabric-profile ${sitio}.txt`;	   // The file to save the data.

let newLink = document.createElement("a");
newLink.download = sFileName;

if (window.webkitURL != null) {
    newLink.href = window.webkitURL.createObjectURL(textToBLOB);
}
else {
    newLink.href = window.URL.createObjectURL(textToBLOB);
    newLink.style.display = "none";
    document.body.appendChild(newLink);
}

newLink.click(); 

}

  }

  

  return(
    <main>
      <input type='checkbox' onChange={nuevoNokia} /> Equipo Nuevo
      <input type='checkbox' onChange={QosNokia} /> Qos General
      <input type='checkbox' onChange={puntoAPunto} /> Punto a Punto
      <input type='checkbox' onChange={sDP} /> SDP
      <br />
      <br />
      <div className="result">
      Script de configuración{nuevoNokiaIsChecked ? " inicial" : ""} para equipo Nokia SAR {nuevoNokiaIsChecked ? "nuevo" : "existente"}.<br />
      </div>
      <form className='container' onSubmit={saveFile}>
        <div>
          <input 
            type='text'
            placeholder='Sitio'
            name='sitio'
            onChange={handleInputChange}
          />
          {nuevoNokiaIsChecked ?
          <div>
            <input 
              type='text'
              placeholder='HOSTNAME'
              name='hostname'
              onChange={handleInputChange}
            />
            <div className='input-inline' >
              <div>IP Address:</div>
              <input 
                className='ipSystem'
                type='number'
                maxLength="3"
                placeholder='___'
                name='ipAddress1'
                onChange={handleInputChange}
              />
              <div>.</div>
              <input 
                className='ipSystem'
                type='number'
                maxLength="3"
                placeholder='___'
                name='ipAddress2'
                onChange={handleInputChange}
              />
              <div>.</div>
              <input 
                className='ipSystem'
                type='number'
                maxLength="3"
                placeholder='___'
                name='ipAddress3'
                onChange={handleInputChange}
              />
              <div>.</div>
              <input 
                className='ipSystem'
                type='number'
                maxLength="3"
                placeholder='___'
                name='ipAddress4'
                onChange={handleInputChange}
              />
              <div>.</div>
              <div>/</div>
              <select defaultValue={25} className='selectMask' name="selMask" onChange={handleInputChange}>
                  <option value="24" >24</option>
                  <option value="25">25</option>
              </select>
            </div>       
            <div className='input-inline'>
              IP Gateway: {datos.ipAddress1}.{datos.ipAddress2}.{datos.ipAddress3}.{ipGW}
            </div>
            <input 
              type='text'
              placeholder='Rutas estatica: pendiente'
              name='staticRoute'
              onChange={handleInputChange}
            />
            <div className='input-inline'>
              <div>IP System: 10.77.181.</div>
              <input 
                className='ipSystem'
                type='number'
                maxLength="3"
                placeholder='___'
                name='ipSystem'
                onChange={handleInputChange}
              />
              <div>/32</div>
            </div>
            
          </div>
           : "" }
        </div>
        <button type='submit'>Descargar SCRIPT</button>
      </form>
    </main>
  )
}