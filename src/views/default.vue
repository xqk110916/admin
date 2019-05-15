<template>
  <div class="content">
      <form action="" class="first">
        <fieldset>
          <legend> 系 统 信 息 </legend>
          <table border="1" cellspacing="0">
            <tr>
              <td class="introduce">web后台版本</td>
              <td class="details">1.0.0</td>
            </tr>
            <tr>
              <td class="introduce">服务器地址</td>
              <td class="details"><a href="https://biz.nanhuacapital.com" target="_blank">https://biz.nanhuacapital.com</a></td>
            </tr>
            <tr>
              <td class="introduce">操作系统</td>
              <td class="details">Linux</td>
            </tr>
            <tr>
              <td class="introduce">运行环境</td>
              <td class="details">Nginx OpenSSL tomcat</td>
            </tr>
          </table>
        </fieldset>
      </form>
      <form action="" class="first" style="margin-top:10px;">
        <fieldset>
          <legend> 开 发 团 队 </legend>
          <table border="1" cellspacing="0">
            <tr>
              <td class="introduce">版权所有</td>
              <td class="details">浙江南华资本管理有限公司</td>
            </tr>
          </table>
        </fieldset>
      </form>
  </div>
</template>

<script>
export default {
    name:'defaults',
}
</script>

<style scoped lang="scss">
.content {
  padding:20px;
}

.first {
  fieldset {
    padding:20px;
    border:1px solid #ccc;

    legend {
      padding: 0 10px;
      font-size: 20px;
      color:#444;
    }
  }

  table {
    border:1px solid #ccc;
    color:#837b7b;
    box-sizing: border-box;
    width: 100%;
    
    td {
       padding: 9px 15px;

       a {
         color:#837b7b;
       }
    }
    .introduce {
      width: 40%;
    }
  }
}
</style>

