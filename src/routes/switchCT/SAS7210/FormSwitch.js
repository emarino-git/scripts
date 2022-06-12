import React, { Fragment, useState } from 'react'

export default function FormSwitch() {
    const [datos, setDatos] = useState({
        cabecera1: '',
        cabecera2: '',
        punto: '',
        ipLan: '',
        ipGW: '',
        ipSystem: '',
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
        const ipSystem = datos.ipSystem
        const vlan = datos.selVLAN

        let data =
`configure
system
    name "SW-${punto}"
    location "${cabecera1} - ${cabecera2}"
    dns
    exit
    console
    exit
    alarm-contact-input console-1
        shutdown
    exit
    resource-profile
        ingress-internal-tcam
            qos-sap-ingress-resource 1
            exit
            acl-sap-ingress 2
            exit
        exit
        egress-internal-tcam
        exit
        router
        exit
        decommission
        exit
    exit
    power-supply 2 dc
    snmp
        packet-size 9216
    exit
    time
        ntp
            ntp-server
            server 192.168.142.60
            no shutdown
        exit
        sntp
            shutdown
        exit
        zone UTC
    exit
    thresholds
        rmon
        exit
    exit
exit
system
    security
        user "edenor"
            password "$2y$10$Iu./BjoXbJd7BIiSqEwXs.uw0tqZqKCnoTHfCjGo95TLXuv4OLx1S"
            access snmp
            snmp
                authentication hash md5 ae1ce6960bebc43d6e476a111c3fc209 privacy des-key ae1ce6960bebc43d6e476a111c3fc209
                group "v3_group"
            exit
        exit
        snmp
            access group "v3_group" security-model usm security-level privacy read "iso" write "iso" notify "iso"
            community "sWuWNM3OAvc" hash2 rwa version both
            community "QyimYx3M3LMM6U9wZcao.k" hash2 r version both
            community "uTdc9j48PBRkxn5DcSjchk" hash2 rwa version both
        exit
        ssh
            preserve-key
        exit
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
    exit
exit
log
    snmp-trap-group 98
        description "5620sam"
        trap-target "10.142.0.123:162" address 10.142.0.123 snmpv2c notify-community "edenor"
        trap-target "1418773566DE:main1" address 10.142.0.123 snmpv2c notify-community "edenortrap98"
    exit
exit
card 1
    mda 1
        no shutdown
    exit
    no shutdown
exit
port 1/1/1
    description "RTU"
    ethernet
        access
        exit
    exit
    no shutdown
exit
port 1/1/2
    ethernet
        access
        exit
    exit
    shutdown
exit
port 1/1/3
    ethernet
        access
        exit
    exit
    shutdown
exit
port 1/1/4
    ethernet
        access
        exit
    exit
    shutdown
exit
port 1/1/5
    ethernet
        access
        exit
    exit
    shutdown
exit
port 1/1/6
    description "local-management"
    ethernet
        access
        exit
    exit
    no shutdown
exit
port 1/1/7
    description "A ${cabecera1}"
    ethernet
        access
        exit
        encap-type dot1q
        mtu 9200
        lldp
            dest-mac nearest-bridge
                admin-status tx-rx
                tx-tlvs port-desc sys-name sys-cap
                tx-mgmt-address system
            exit
        exit
    exit
    no shutdown
exit
port 1/1/8
    description "A ${cabecera2}"
    ethernet
        access
        exit
        encap-type dot1q
        mtu 9200
        lldp
            dest-mac nearest-bridge
                admin-status tx-rx
                tx-tlvs port-desc sys-name sys-cap
                tx-mgmt-address system
            exit
        exit
    exit
    no shutdown
exit
port 1/1/9
    shutdown
    ethernet
        access
        exit
    exit
exit
port 1/1/10
    shutdown
    ethernet
        access
        exit
    exit
exit
port 1/1/11
    shutdown
    ethernet
        access
        exit
    exit
exit
port 1/1/12
    shutdown
    ethernet
        access
        exit
    exit
exit
router Base
    interface "system"
        description IP-System
        address ${ipSystem}/32
    exit
    static-route 0.0.0.0/0 next-hop ${ipGW}
exit
service
    customer 1 create
        description "Default customer"
    exit
    ies 1 customer 1 create
        interface "management" create
        exit
    exit
    ies 1 customer 1 create
        description "management"
        interface "management" create
            address ${ipLan}/25
            vpls "mgmt"
            exit
        exit
        no shutdown
    exit
    ies 2 customer 1 create
        interface "telecontrol" create
        exit
    exit
    ies 2 customer 1 create
        description "telecontrol"
        interface "telecontrol" create
            vpls "telecontrol"
            exit
        exit
        no shutdown
    exit
    vpls 1${vlan} customer 1 svc-sap-type any create
        description "Management"
        allow-ip-int-bind
        exit
        stp
            no shutdown
        exit
        service-name "mgmt"
        sap 1/1/6 create
            statistics
                ingress
                exit
            exit
            egress
            exit
        exit
        sap 1/1/7:0 create
            description "uplink"
            statistics
                ingress
                exit
            exit
            egress
            exit
        exit
        sap 1/1/8:0 create
            description "uplink"
            statistics
                ingress
                exit
            exit
            egress
            exit
        exit
        no shutdown
    exit
    vpls ${vlan} customer 1 svc-sap-type any create
        description "Telecontrol"
        allow-ip-int-bind
        exit
        stp
            no shutdown
        exit
        service-name "telecontrol"
        sap 1/1/1 create
            statistics
                ingress
                exit
            exit
            egress
            exit
        exit
        sap 1/1/7:${vlan} create
            statistics
                ingress
                exit
            exit
            egress
            exit
        exit
        sap 1/1/8:${vlan} create
            statistics
                ingress
                exit
            exit
            egress
            exit
        exit
        no shutdown
    exit
    vpls 1${vlan} customer 1 svc-sap-type any create
        allow-ip-int-bind
        exit
    exit
    vpls ${vlan} customer 1 svc-sap-type any create
        allow-ip-int-bind
        exit
    exit
exit
system
    security
        source-address
            application snmptrap "management"
            application ntp "management"
        exit
    exit
exit
system
    time
        ntp
        exit
    exit
exit
exit all
admin save SW-${punto}.cfg
bof primary-config cf1:\\SW-${punto}.cfg
bof save
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
                <h3>Switch para CTs Nokia SAS-7210</h3>
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
                        <input 
                            type='text'
                            placeholder='IP System'
                            name='ipSystem'
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
