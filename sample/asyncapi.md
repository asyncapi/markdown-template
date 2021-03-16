# Streetlights API 1.0.0 documentation

The Smartylighting Streetlights API allows you to remotely manage the city lights.

### Check out its awesome features:

* Turn a specific streetlight on/off 🌃
* Dim a specific streetlight 😎
* Receive real-time information about environmental lighting conditions 📈

## Table of Contents

* [Servers](#servers)
* [Channels](#channels)

## Servers

### **production** Server

| URL | Protocol | Description |
|-|-|-|
| test.mosquitto.org:{port} | mqtt | Test broker |

#### URL Variables

| Name | Default value | Possible values | Description |
|-|-|-|-|
| port | 1883 | 1883, 8883 | Secure connection (TLS) is available through port 8883. |

#### Security Requirements

| Type | In | Name | Scheme | Format | Description |
|-|-|-|-|-|-|
| apiKey | user | - | - | - | Provide your API key as the user and leave the password empty. |
| oauth2 | - | - | - | - | Flows to support OAuth 2.0 |
| openIdConnect | - | - | - | - | - |

## Channels

### **smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured** Channel

The topic on which measured values may be produced and consumed.

#### Channel Parameters

| Name | Type | Description | Accepted values |
|-|-|-|-|
| streetlightId | string | The ID of the streetlight. | _Any_ |


#### `publish` Operation

*Inform about environmental lighting conditions of a particular streetlight.*

##### Message

*Inform about environmental lighting conditions of a particular streetlight.*

###### Headers

| Name | Type | Description | Accepted values |
|-|-|-|-|
| my-app-header | integer | - | _Any_ |

> Examples of headers _(generated)_

```json
{
  "my-app-header": 0
}
```


###### Payload

| Name | Type | Description | Accepted values |
|-|-|-|-|
| lumens | integer | Light intensity measured in lumens. | _Any_ |
| sentAt | string | Date and time when the message was sent. | _Any_ |

> Examples of payload _(generated)_

```json
{
  "lumens": 0,
  "sentAt": "2019-08-24T14:15:22Z"
}
```




### **smartylighting/streetlights/1/0/action/{streetlightId}/turn/on** Channel

#### Channel Parameters

| Name | Type | Description | Accepted values |
|-|-|-|-|
| streetlightId | string | The ID of the streetlight. | _Any_ |


#### `subscribe` Operation

##### Message

*Command a particular streetlight to turn the lights on or off.*

###### Headers

| Name | Type | Description | Accepted values |
|-|-|-|-|
| my-app-header | integer | - | _Any_ |

> Examples of headers _(generated)_

```json
{
  "my-app-header": 0
}
```


###### Payload

| Name | Type | Description | Accepted values |
|-|-|-|-|
| command | string | Whether to turn on or off the light. | on, off |
| sentAt | string | Date and time when the message was sent. | _Any_ |

> Examples of payload _(generated)_

```json
{
  "command": "on",
  "sentAt": "2019-08-24T14:15:22Z"
}
```




### **smartylighting/streetlights/1/0/action/{streetlightId}/turn/off** Channel

#### Channel Parameters

| Name | Type | Description | Accepted values |
|-|-|-|-|
| streetlightId | string | The ID of the streetlight. | _Any_ |


#### `subscribe` Operation

##### Message

*Command a particular streetlight to turn the lights on or off.*

###### Headers

| Name | Type | Description | Accepted values |
|-|-|-|-|
| my-app-header | integer | - | _Any_ |

> Examples of headers _(generated)_

```json
{
  "my-app-header": 0
}
```


###### Payload

| Name | Type | Description | Accepted values |
|-|-|-|-|
| command | string | Whether to turn on or off the light. | on, off |
| sentAt | string | Date and time when the message was sent. | _Any_ |

> Examples of payload _(generated)_

```json
{
  "command": "on",
  "sentAt": "2019-08-24T14:15:22Z"
}
```




### **smartylighting/streetlights/1/0/action/{streetlightId}/dim** Channel

#### Channel Parameters

| Name | Type | Description | Accepted values |
|-|-|-|-|
| streetlightId | string | The ID of the streetlight. | _Any_ |


#### `subscribe` Operation

##### Message

*Command a particular streetlight to dim the lights.*

###### Headers

| Name | Type | Description | Accepted values |
|-|-|-|-|
| my-app-header | integer | - | _Any_ |

> Examples of headers _(generated)_

```json
{
  "my-app-header": 0
}
```


###### Payload

| Name | Type | Description | Accepted values |
|-|-|-|-|
| percentage **(required)** | integer | Percentage to which the light should be dimmed to. | _Any_ |
| sentAt | string | Date and time when the message was sent. | _Any_ |

> Examples of payload _(generated)_

```json
{
  "percentage": 0,
  "sentAt": "2019-08-24T14:15:22Z"
}
```




