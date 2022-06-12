import React, { Fragment, useState } from 'react'

export default function FormSwitch() {
    const [datos, setDatos] = useState({
        cabecera1: '',
        cabecera2: '',
        punto: '',
        ipLan: '',
        ipGW: '',
        selVLAN: ''
    })

    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name] : event.target.value
        })
    }

    const saveFile = (event) => {
        event.preventDefault()
        const cabecera1 = datos.cabecera1
        const cabecera2 = datos.cabecera2
        const punto = datos.punto
        const ipLan = datos.ipLan
        const ipGW = datos.ipGW
        const vlan = datos.selVLAN

        let data =
`version 15.2
no service pad
service timestamps debug datetime msec
service timestamps log datetime msec
service password-encryption
!
hostname SW-${punto}
!
boot-start-marker
boot-end-marker
!
!
enable secret 5 $1$d3d.$L4zKcX3EVLik8yX0lAGUM1
!
username ingenieria password 7 094D4A05180B04055A5D
no aaa new-model
system mtu routing 1500
!
!
!
!
!
!
vlan 1${vlan}
name Management
!
!
vlan ${vlan}
name TLC-CTxFO
!
interface Vlan1${vlan}
 no shutdown
 description Management
 ip address ${ipLan} 255.255.255.128
!
ip default-gateway ${ipGW}
no ip http server
no ip http secure-server
ip forward-protocol nd
!
!
ip domain-name pro.edenor
no ip cef
!
crypto key generate rsa
1024
!
!
spanning-tree mode rapid-pvst
spanning-tree extend system-id
!
alarm profile defaultPort
 alarm not-operating
 syslog not-operating
 notifies not-operating
!
!
!
vlan internal allocation policy ascending
!
!
!
!
!
!
interface FastEthernet0/1
 description RTU
 switchport access vlan ${vlan}
!
interface FastEthernet0/2
 shutdown
!
interface FastEthernet0/3
 shutdown
!
interface FastEthernet0/4
 shutdown
!
interface GigabitEthernet0/1
 description A ${cabecera1}
 switchport trunk allowed vlan ${vlan},1${vlan}
 switchport trunk native vlan 1${vlan}
 switchport mode trunk
!
interface GigabitEthernet0/2
 description A ${cabecera2}
 switchport trunk allowed vlan ${vlan},1${vlan}
 switchport trunk native vlan 1${vlan}
 switchport mode trunk
!
interface Vlan1
 no ip address
!
line con 0
 login local
line vty 0 4
 login local
 transport input ssh
line vty 5 15
 login local
 transport input ssh
!
ntp server 192.168.142.60
!
snmp-server community monitoreo RO
snmp-server user edenor monitoreo v3 auth md5 12345678 priv des 12345678
snmp-server group monitoreo v3 priv
!
do wr
!
`

    // Convert the text to BLOB.
    const textToBLOB = new Blob([data], { type: 'text/plain' });
    const sFileName = `SW-${punto}.txt`;	   // The file to save the data.

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

    return(
        <Fragment>
            <main style={{ padding: "1rem 0" }}>
                <h3>Switch para CTs Cisco IE-2000</h3>
                <form className='container' onSubmit={saveFile}>
                    <div>
                        <input 
                            type='text'
                            placeholder='Cabecera 1'
                            name='cabecera1'
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <input 
                            type='text'
                            placeholder='Cabecera 2'
                            name='cabecera2'
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <input 
                            type='text'
                            placeholder='Punto TLC'
                            name='punto'
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <input 
                            type='text'
                            placeholder='IP Lan'
                            name='ipLan'
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <input 
                            type='text'
                            placeholder='Gateway'
                            name='ipGW'
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <select name="selVLAN" onChange={handleInputChange}>
                            <option selected value="">-- Seleccionar VLAN --</option>
                            <option value="34">MGMT: 134 RTU:34</option>
                            <option value="35">MGMT: 135 RTU:35</option>
                            <option value="36">MGMT: 136 RTU:36</option>
                            <option value="37">MGMT: 137 RTU:37</option>
                            <option value="38">MGMT: 138 RTU:38</option>
                        </select>
                    </div>
                    <button type='submit'>Descargar SCRIPT</button>
                </form>
            </main>
        </Fragment>
    )
}
