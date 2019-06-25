(function () {
  window.onload = function () {
    var staticData = {
      newsLength: 5,
    }
    var indexMode = {
      init: function () {
        this.totalEvents();
      },
      totalEvents: function () {
        this.scrollFn();
        this.mouseenterEvent();
        this.animation();
        this.carousel();
        this.clickEvents();
        this.videoEvents();
        this.getNewsData();
        this.clickNewsTab()
      },
      // 滑轮滚动一定距离，头部变化
      scrollFn: function () {
        $(window).scroll(function () {
          indexMode.animation();
        });
      },
      // 头部变化
      animation: function () {
        var scrollHeight = $(window).scrollTop();
        if (scrollHeight >= 80) {
          $('.top').css('display', 'none');
          $('.top_scroll').css('display', 'block');
        } else {
          $('.top').css('display', 'block');
          $('.top_scroll').css('display', 'none');
        }
        if (scrollHeight >= 1100) {
          $('.third_person').animate({
            left: '-300px',
            bottom: '-135px'
          }, 1000)
        }
      },
      mouseenterEvent: function () {
        $('.video_tab_li').mouseenter(function () {
          $('.video_tab_li').removeClass('active');
          $(this).addClass('active');
          $('.video_box').removeClass('active').addClass('hide');
          $('.video_box').eq($(this).index()).removeClass('hide').addClass('active');
        });
        $('.video_mask').mouseenter(function () {
          $(this).addClass('hide');
        }).mouseleave(function () {
          $(this).removeClass('hide');
        });
      },
      clickEvents: function () {
        let video = document.getElementsByClassName('video');
        $('.video_button').click(function () {
          let v_attr = $(this).parent().siblings('video').attr('src');
          $('.big_video_box').find('video').attr('src', v_attr);
          $('.big_video_box').show();
        });
        $('.close_video').click(() => {
          $('.big_video_box').find('video').attr('src', '');
          $('.big_video_box').hide();
        })
      },
      videoEvents: function () {
        let v = document.getElementsByClassName('video');

      },



      // 轮播图
      carousel: function () {
        let flag = true;
        let index = 1;
        $('.carousel_item').last().clone().insertBefore($('.carousel_item').first());
        $('.carousel_item').eq(1).clone().appendTo('.carousel_ul');
        let len = $('.carousel_item').length;
        let p_width = $('.carousel_item img').width();
        $('.carousel_ul').css('left', '' + -p_width + '');
        let timerID = setInterval(selectPic, 3000);
        $('.carousel_box').mouseenter(() => {
          clearInterval(timerID);
        }).mouseleave(() => {
          timerID = setInterval(selectPic, 3000);
        })
        // 自动切换图片
        function selectPic() {
          // 初始   

          if (index < (len - 2) && index > 0) {
            flag = false;
            $('.carousel_ul').animate({
              left: '' + (-p_width) * (index + 1) + 'px'
            }, 800, 'linear', function () {
              flag = true;
            })
            index++;

          } else if (index === (len - 2)) {
            flag = false;
            $('.carousel_ul').animate({
              left: '' + (-p_width) * (index + 1) + 'px'
            }, 800, 'linear', function () {
              $('.carousel_ul').css('left', -p_width);
              flag = true;
            });
            index = 1;
          }
        }
        $('.arrow_right').click(function () {
          if (flag) {
            clearInterval(timerID);
            selectPic();
            timerID = setInterval(selectPic, 3000);
          }
        });
        $('.arrow_left').click(function () {
          if (flag) {
            flag = !flag;
            clearInterval(timerID);
            if (index === 1) {
              $('.carousel_ul').animate({
                left: '0px'
              }, 800, 'linear', function () {
                $('.carousel_ul').css('left', -(len - 2) * p_width);
                flag = !flag;
              })
              index = len - 2;
            } else {
              $('.carousel_ul').animate({
                left: '' + (-p_width) * (index - 1) + 'px'
              }, 800, 'linear', function () {
                flag = !flag;
              })
              index--;
            }
            timerID = setInterval(selectPic, 3000);
          }
        })
      },




      // 第一次 页面加载之后，读取新闻列表（包括类型，title，date）
      // 最新的
      getNewsData: function () {

        $.ajax({
          type: "get",
          url: "http://api.paopao.vip/news/item",
          dataType: "json",
          success: function (response) {
            if (response.code === 0) {
              var all_li = '';
              var data = response.data.records;
              var len = data.length;
              all_li = len > staticData.newsLength ? indexMode.tempNewsItem(data, staticData.newsLength) : indexMode.tempNewsItem(data, len);
              $('.look_more').attr('type', '最新');
              $('.news_ul').html(all_li);
              $('.news_item').mouseenter(function () {
                $('.news_item').removeClass('active');
                $(this).addClass('active');
              });

              // 点击新闻列表跳转到新闻详情
              $('.news_item').click(function () {
                window.location = 'file:///D:/pp-study/hmk-views/newscenter.html?id=' + $(this).attr('id') + '&&type_id=' + $(this).attr('type_id');

              });
              $('.look_more').click(function () {
                window.location = 'file:///D:/pp-study/hmk-views/newscenter.html?type=' + $(this).attr('type');
              });
            }
          }
        });
      },
      // 获取新闻或者活动列表
      clickNewsTab: function () {
        $('.news_tab_item').click(function () {
          if (!($(this).hasClass('active'))) {
            var newsType = $(this).find('.news_ch').text();
            $('.news_tab_item').removeClass('active');
            $(this).addClass('active');
            if (newsType == '最新') {
              indexMode.getNewsData();
            } else {
              $.ajax({
                type: "get",
                url: "http://api.paopao.vip/news/item",
                dataType: "json",
                success: function (response) {
                  if (response.code === 0 && response.data.count > 0) {
                    var data = response.data.records;
                    var TypeArr = data.filter((item) => {
                      return item.type == newsType;
                    })
                    var all_li = TypeArr.length > staticData.newsLength ? indexMode.tempNewsItem(data, staticData.newsLength) : indexMode.tempNewsItem(data, TypeArr.length);
                    $('.look_more').attr('type', newsType);
                    $('.news_ul').html(all_li);
                    $('.news_item').mouseenter(function () {
                      $('.news_item').removeClass('active');
                      $(this).addClass('active');
                    });
                    // 点击新闻列表跳转到新闻详情
                    $('.news_item').click(function () {
                      window.location = 'file:///D:/pp-study/hmk-views/newscenter.html?id=' + $(this).attr('id') + '&&type_id=' + $(this).attr('type_id');
                    });
                  }
                }
              });
            }
          }
        })
      },
      tempNewsItem: function (data, len) {
        var temp = '';
        for (let i = 0; i < len; i++) {
          temp += '<li class="news_item" id="' + data[i]._id + '" type_id="' + data[i].type_id + '">' +
            '<span class="news_icon">' + data[i].type + '</span>' +
            '<div class="news">' +
            '<span class="news_content">' + data[i].title + '</span>' +
            '<span class="news_date">' + indexMode.getDate(data[i].itime) + '</span>' +
            '</div>' +
            '</li>';
        }
        return temp;
      },
      getDate: function (time) {
        let date = new Date(time * 1000);
        let year = date.getFullYear();
        let month = ((date.getMonth() + 1) >= 10) ? date.getMonth() + 1 : '0' + (date.getMonth() + 1).toString();
        let day = (date.getDay() >= 10) ? date.getDay() : '0' + (date.getDay().toString());
        return month + '-' + day;
      }
    }
    indexMode.init();
  }
}())