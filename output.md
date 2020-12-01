# Streetlights API 1.0.0 documentation

The Smartylighting Streetlights API allows you to remotely manage the city lights.

### Check out its awesome features:

* Turn a specific streetlight on/off 🌃
* Dim a specific streetlight 😎
* Receive real-time information about environmental lighting conditions 📈

## Table of Contents

* [Terms of Service](#terms-of-service)
* [Servers](#servers)
* [Channels](#channels)

<a name="terms-of-service"></a>
## Terms of service

[http://asyncapi.org/terms/](http://asyncapi.org/terms/)

<a name="servers"></a>
## Servers

### **production** Server

| URL | Protocol | Description |
|-|-|-|
| mqtt://test.mosquitto.org:{port} | mqtt | Test broker |

#### URL Variables

| Name | Default value | Possible values | Description |
|-|-|-|-|
| port | 1883 | 1883, 8883 | Secure connection (TLS) is available through port 8883. |

#### Security Requirements

| Type | In | Name | Scheme | Format | Description |
|-|-|-|-|-|-|
| http | - | - | bearer | - | - |


<a name="channels"></a>
## Channels

<a name="smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured-channels"></a>
### **smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured** Channel

The topic on which measured values may be produced and consumed.

#### Channel Parameters

##### streetlightId

The ID of the streetlight.
| Name | Type | Description | Accepted values |
|-|-|-|-|
| streetlightId | string | - | _Any_ |



#### `publish` Operation

*Inform about environmental lighting conditions of a particular streetlight.*

This is the description with **bold** text.

On multiple lines.


##### Message

*Inform about environmental lighting conditions of a particular streetlight.*

###### Headers

| Name | Type | Description | Accepted values |
|-|-|-|-|
| my-app-header | integer | - | _Any_ |

###### Examples of headers _(generated)_

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

###### Examples of payload _(generated)_

```json
{
  "lumens": 0,
  "sentAt": "2019-08-24T14:15:22Z"
}
```


###### Tags

* message-tag1
* message-tag2
* message-tag3
* message-tag4
* message-tag5



<a name="smartylighting/streetlights/1/0/action/{streetlightId}/turn/on-channels"></a>
### **smartylighting/streetlights/1/0/action/{streetlightId}/turn/on** Channel

#### Channel Parameters

##### streetlightId

The ID of the streetlight.
| Name | Type | Description | Accepted values |
|-|-|-|-|
| streetlightId | string | - | _Any_ |



#### `subscribe` Operation

##### Message

*Command a particular streetlight to turn the lights on or off.*

###### Headers

| Name | Type | Description | Accepted values |
|-|-|-|-|
| my-app-header | integer | - | _Any_ |

###### Examples of headers _(generated)_

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

###### Examples of payload _(generated)_

```json
{
  "command": "on",
  "sentAt": "2019-08-24T14:15:22Z"
}
```




<a name="smartylighting/streetlights/1/0/action/{streetlightId}/turn/off-channels"></a>
### **smartylighting/streetlights/1/0/action/{streetlightId}/turn/off** Channel

#### Channel Parameters

##### streetlightId

The ID of the streetlight.
| Name | Type | Description | Accepted values |
|-|-|-|-|
| streetlightId | string | - | _Any_ |



#### `subscribe` Operation

##### Message

*Command a particular streetlight to turn the lights on or off.*

###### Headers

| Name | Type | Description | Accepted values |
|-|-|-|-|
| my-app-header | integer | - | _Any_ |

###### Examples of headers _(generated)_

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

###### Examples of payload _(generated)_

```json
{
  "command": "on",
  "sentAt": "2019-08-24T14:15:22Z"
}
```




<a name="smartylighting/streetlights/1/0/action/{streetlightId}/dim-channels"></a>
### **smartylighting/streetlights/1/0/action/{streetlightId}/dim** Channel

#### Channel Parameters

##### streetlightId

The ID of the streetlight.
| Name | Type | Description | Accepted values |
|-|-|-|-|
| streetlightId | string | - | _Any_ |



#### `subscribe` Operation

##### Message

*Command a particular streetlight to dim the lights.*

###### Headers

| Name | Type | Description | Accepted values |
|-|-|-|-|
| my-app-header | integer | - | _Any_ |

###### Examples of headers _(generated)_

```json
{
  "my-app-header": 0
}
```


###### Payload

| Name | Type | Description | Accepted values |
|-|-|-|-|
| percentage | integer | Percentage to which the light should be dimmed to. | _Any_ |
| sentAt | string | Date and time when the message was sent. | _Any_ |

###### Examples of payload _(generated)_

```json
{
  "percentage": 0,
  "sentAt": "2019-08-24T14:15:22Z"
}
```




<a name="some.channel-channels"></a>
### **some.channel** Channel

#### `subscribe` Operation

this doesn't show in markdown!

Accepts **one of** the following messages:

##### Message `Success`

###### Payload

| Name | Type | Description | Accepted values |
|-|-|-|-|
| result | anyOf | - | _Any_ |
| result.0 | string | - | _Any_ |
| result.1 | number | - | _Any_ |

###### Examples of payload _(generated)_

```json
{
  "result": "success"
}
```


##### Message `Failure`

###### Payload

| Name | Type | Description | Accepted values |
|-|-|-|-|
| error | object | - | _Any_ |
| error.errorCode | integer | - | _Any_ |
| error.errorMessage | string | - | _Any_ |

###### Examples of payload

```json
{
  "error": {
    "errorCode": 404,
    "errorMessage": "Something messed up"
  }
}
```





