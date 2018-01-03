$(document).ready(function(){
    if(navigator.userAgent.toLowerCase().indexOf("iphone") > -1){
        if(window.navigator.standalone == false){
            swal({
                title: 'Hey',
                text:
                    'You can add the app to the Home Screen for a better game experience',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: 'Add to Home Screen',
                cancelButtonText: 'No, stay on page'
            }).then((result) => {
                if (result.value) {
                swal({
                    position: 'bottom',
                    title: 'Add to Home Screen',
                    text:
                        'Tap below to add an icon to your Home Screen',
                    confirmButtonText: '👇'
                })}})
        }
    }

    if(navigator.userAgent.toLowerCase().indexOf("android") > -1){
        swal({
            title: 'Hey',
            text:
            'You can download this app from the Play Store',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Download',
            cancelButtonText: 'No, stay on page'
        }).then((result) => {
        if (result.value) {
            window.location = "http://play.google.com/store/apps/details?id=ch.pandermatt.taptheball";
        }})
    }
});
