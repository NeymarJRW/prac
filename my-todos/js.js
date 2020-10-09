$(function () {
  var mytodos = {
    allselect: false,
    name: 'mytodo',
    //启动
    init: function () {
      this.getdata()
      this.inititem()
      $('.todos .top')
        .on('keydown', '.inp', this.adddata.bind(this))
        .on('click', '.select', this.selectall.bind(this));
      $('.todos .center')
        .on('click', '.select', this.selectitem.bind(this))
        .on('click', '.delcurrent', this.delcurrentitem.bind(this))
      $('.footer .del_item')
        .on('click', '.dellogo', this.delitem.bind(this))
      this.all_unselect_render()
    },
    //存储数组数据
    savedata: function () {
      localStorage.setItem(this.name, JSON.stringify(this.datalist))
    },
    //获取当前数组数据
    getdata: function () {
      this.datalist =
        JSON.parse(localStorage.getItem(this.name)) || [{
          "value": 'do something....',
          "select": false
        }];
      this.datalistlen = this.datalist.length;
    },
    //初始化时所有为选中选项
    all_unselect_render: function () {
      this.getdata()
      var str = ''
      for (var i = 0; i < this.datalistlen; i++) {
        str += `<li>
          <span class="select" value="${i}"></span>
          <p class="item">${this.datalist[i].value}</p>
          <input type="text" class="clickinp">
          <span class = "delcurrent fr"
          value = "${i}" > &times; </span>
          </li>`
      }
      $('.center ul').html(str)

    },
    //所有选中的选项
    all_select_render: function () {
      this.getdata()
      var str = ''
      for (var i = 0; i < this.datalistlen; i++) {
        str += `<li>
      <span class = "select select_item"
      value = "${i}" > </span>
      <p class = "item selected_item"> ${
        this.datalist[i].value} </p>
      <input type="text" class="clickinp">
      <span class = "delcurrent fr"
      value = "${i}" > &times; </span>
      </li>`
      }
      $('.center ul').html(str)
    },
    //输入完成后按下回车追加数据
    adddata: function (e) {
      if (e.keyCode == 13 && e.target.value.trim() !== '') {
        this.allselect = false;
        $('.todos .top .select').removeClass('select_item');
        this.datalist.forEach(item => {
          item.select = false;
        });
        var newdata = {
          "value": $('.todos .top .inp').val(),
          "select": false
        }
        // console.log(localStorage.getItem(this.name))
        if (localStorage.getItem(this.name)) {
          this.datalist.push(newdata)
        } else {
          this.datalist = [newdata]
        }
        e.target.value = ''
        this.savedata()
        this.all_unselect_render()
      }

    },
    //点击全选按钮选择全部
    selectall: function () {
      if (!localStorage.getItem(this.name)) return;
      $('.todos .top .select').toggleClass('select_item');
      this.allselect = !this.allselect;
      if (this.allselect) {
        this.all_select_render()
        this.datalist.forEach(item => {
          item.select = true;
        });
      } else {
        this.all_unselect_render()
        this.datalist.forEach(item => {
          item.select = false;
        });
      }
      this.savedata()
      this.delitemnum()
    },
    //点击单个选项选中
    selectitem: function (e) {
      if (!localStorage.getItem(this.name)) return;
      var listP = e.target.parentNode
      var listnum = Number(e.target.getAttribute('value'))
      this.datalist[listnum].select = !this.datalist[listnum].select;
      this.savedata()
      if (this.datalist[listnum].select) {
        e.target.className = 'select select_item'
        listP.querySelector('p').className = 'item selected_item'
      } else {
        e.target.className = 'select'
        listP.querySelector('p').className = 'item'
      }
      if (this.datalist.filter(item => item.select).length == 0) {
        this.allselect = false;
        $('.todos .top .select').removeClass('select_item');
      } else if (this.datalist.filter(item => item.select).length == this.datalistlen) {
        this.allselect = true;
        $('.todos .top .select').addClass('select_item');
      } else {
        this.allselect = false;
        $('.todos .top .select').removeClass('select_item');
      }
      this.delitemnum()
    },
    //初始化时让所有选项为未选中
    inititem: function () {
      if (localStorage.getItem(this.name)) {
        this.datalist.forEach(item => {
          item.select = false
        })
        this.savedata()
      }

    },
    //获取提示要删除的项目数
    delitemnum: function () {
      var num = 0;
      this.datalist.forEach(item => {
        if (item.select) num++
      })
      $('.footer .deltotal').html(num)
    },
    //删除选中项目
    delitem: function () {
      if (!localStorage.getItem(this.name)) return;
      this.datalist = this.datalist.filter((item) => !item.select)
      this.allselect = false;
      $('.todos .top .select').removeClass('select_item');
      if (this.datalist.length == 0) {
        localStorage.removeItem(this.name)
      } else {
        this.savedata()
      }
      this.getdata()
      this.all_unselect_render()
      $('.footer .deltotal').html(0)
    },
    //点击删除按钮删除选项
    delcurrentitem: function (e) {
      if (!localStorage.getItem(this.name)) return;
      var delnum = Number(e.target.getAttribute('value'));
      this.datalist.splice(delnum, 1)
      this.allselect = false;
      $('.todos .top .select').removeClass('select_item');

      this.savedata()
      if (this.datalist.length == 0) {
        localStorage.removeItem(this.name)
      } else {
        this.savedata()
      }
      $('.footer .deltotal').html(0)
      this.getdata()
      this.all_unselect_render()

    }
  }
  mytodos.init()
})