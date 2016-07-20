/**
 * Created by TuanAnh on 25/03/2016.
 */

angular.module('fptdriveApp').
factory('DeviceFactory', ['$http', function($http) {

  var busInfos = [
    [{"name":"ID", "value":"33d1ddff-aeb8-38a1-a00d-3c2cf31bc62e"},{"name":"Tuyến", "value":"09"},{"name":"Lộ Trình", "value":"Cầu Giấy - Thuỵ Khuê"}],
    [{"name":"ID", "value":"7cb02aa4-e730-30d2-aa54-4989539067ac"}, {"name":"Tuyến", "value":"25"}, {"name":"Lộ Trình","value":"Đại Học Ngoại Thương - Liễu Giai"}],
    [{"name":"ID", "value":"ec87c2cc-ab87-35e1-bfd3-be0ea449fcd5"}, {"name":"Tuyến", "value":"35"}, {"name":"Lộ Trình","value":"Mỹ Đình - Bảo Tàng Dân Tộc Học"}],
    [{"name":"ID", "value":"07885ef8-f62c-3a56-849f-c91b3e5d6be8"}, {"name":"Tuyến", "value":"06"}, {"name":"Lộ Trình","value":"Đỗ Đình Thiện - Doãn Kế Thiện"}]
  ];

  var device = {
    "c603d35d-2029-363e-a093-0c76a8a323f7": 1,
    "1e91a099-a339-3d39-b31d-76bead836864": 2,
    "cc487baa-c99d-3935-9316-1efa28cb68ee": 3,
    "90a2c97e-c490-33cb-89ee-049b92794e37": 4,
    "33d1ddff-aeb8-38a1-a00d-3c2cf31bc62e": 1,
    "7cb02aa4-e730-30d2-aa54-4989539067ac": 2,
    "ec87c2cc-ab87-35e1-bfd3-be0ea449fcd5": 3,
    "07885ef8-f62c-3a56-849f-c91b3e5d6be8": 4,
    "6197703c-76d0-3336-86df-861a8fa66f74": 1,
    "fa8a71fa-dd59-3253-92f4-e6d0c1d342f8": 2,
    "9e3cb0b6-f71d-3435-90ec-9015bb82e29c": 3,
    "2fbc801c-1d5f-3f9c-94f0-2452ca005f5c": 4,
    "339260b3-57d4-352d-a37b-98be4445505b": 1,
    "b57c1702-127d-3f03-bcc0-7b27b3db5bde": 2,
    "ac5011da-4044-38db-974c-551129e0ffc8": 3,
    "c9e1b5ab-3086-3650-8e43-1fe5a314623b": 4,
    "b281bdbc-6d96-3fc5-967c-92042163c6af": 1,
    "cb1e8f1e-7682-30e3-ba61-9297642cb2df": 2,
    "737f3355-365d-3fc1-a435-78bfbc423731": 3,
    "fcaf47ae-b1d5-36e4-b3f7-eec35f7c9d9d": 4
  };

  var sharedBus = [];

  return {
    setDevice: function(){
      // Call to backend to get device relation from back-end
      // $http.get("api/assest/")
    },
    getBus: function (device_id) {
      return device[device_id];
    },

    getBusInfo: function (bus_id) {
    	console.log("BUSID: " + bus_id) ;
    	sharedBus = busInfos[bus_id];
    	return sharedBus;
      // for (i = 0; i < busInfos.length; i++) {
        // for (j = 0; j < busInfos[i].length; j++) {
          // if (busInfos[i][j].value == bus_id) {
            // sharedBus = busInfos[i];
            // return busInfos[i];     // return information about the desired bus
          // }   
        // }
      // }
    },

    getCurrentBusInfo: function() {
      return sharedBus;
    }
  };
}]);
