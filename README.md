# notification.js
Too many different javascript notification libraries, each one with different API's... what about using all them with the same parameters and API?

That's what notification.js does: Extend the same parameters and behaviour to different notification libraries around the internet. So you can change from one to another with zero effort.


## Libraries supported

At this time notification.js supports:

- amaranJS                  [https://github.com/hakanersu/AmaranJS]
- jquery-toast-plugin       [https://github.com/kamranahmedse/jquery-toast-plugin]
- toastr                    [https://github.com/CodeSeven/toastr]

## Setup

Include both ``` notification.min.js ``` and ``` notification.min.css ``` in your document.

```html
<script src="notification.min.js"></script>
<link href="notification.min.css" type="text/css" rel="stylesheet" media="screen">
```

To install the notification libraries look at the instructions on their github pages.

## Usage

Demo can be found at http://ppizarror.com/notification.js/

### Init the notification manager

```javascript
NotificationJS.init({options});
```

### Options

| Option | Type | Default | Description |
| :-:|:-:|:-:|:--|
| core | string | "jquery-toast-plugin" | Notification library, avaiable: amaranjs,jquery-toast-plugin,toastr |
| enabled | boolean | true | Enable/disables notifications |
| exceptionTitle | string | "Exception" | Title of exception notification |
| maxStack | number | 5 | Max notification stack |
| timeout | number | 5000 | Notification time before hide (ms) |

### API

#### Notification

- Info

>```javascript
>NotificationJS.info(message, options);
>```

- Success

>```javascript
>NotificationJS.success(message, options);
>```

- Warning

>```javascript
>NotificationJS.warning(message, options);
>```

- Error

>```javascript
>NotificationJS.error(message, options);
>```

- Exception

>```javascript
>NotificationJS.exception(Error, options);
>```

- Other

>```javascript
>NotificationJS.other(message, options);
>```

Where *options*:

| Option | Type | Default | Description |
| :-:|:-:|:-:|:--|
| persistent | boolean | false | Notification doesn't close after timeout |
| closebutton | boolean | false | Show close button |
| doubletime | boolean | false | Doubles timeout |
| onclick | function | null | Onclick function |

#### Other methods

- Close all notifications

>```javascript
>NotificationJS.closeall();
>```

- Close last notification

>```javascript
>NotificationJS.closelast();
>```

## TO-DO

- Add more configurations
- Fix clearlast() method
- Add more libraries

## License
This project is licensed under MIT [https://opensource.org/licenses/MIT]

## Author
<a href="http://ppizarror.com" title="ppizarror">Pablo Pizarro R.</a> | 2018-2019