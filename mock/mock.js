const axios = require("axios")
// 引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random
const url = require('url')
const groupRouter = '/BusinessServer'
const baseURL = 'http://192.168.50.26:8088'+groupRouter
// 生成随机保障项目数据
function generateRandomProjects() {
  const projects = [{
      "项目名称": "意外住院津贴",
      "费用范围": Random.integer(1, 100) + "万元"
    },
    {
      "项目名称": "住院医疗",
      "费用范围": Random.integer(1, 100) + "万元"
    },
    {
      "项目名称": "疾病身故、全残",
      "费用范围": Random.integer(1, 100) + "万元"
    },
    {
      "项目名称": "重大疾病",
      "费用范围": Random.integer(1, 100) + "万元"
    },
    {
      "项目名称": "身故伤残保险责任",
      "费用范围": Random.integer(1, 100) + "万元"
    },
    {
      "项目名称": "意外伤害医疗(含门诊及住院)",
      "费用范围": Random.integer(1, 100) + "万元"
    },
    {
      "项目名称": "意外伤害身故和残疾",
      "费用范围": Random.integer(1, 100) + "万元"
    }
  ];

  return projects;
}

const schemes = [];
const schemeNames = ["普通版", "高级版", "豪华版", "至尊版"];

for (let i = 0; i < schemeNames.length; i++) {
  const scheme = {
    "name": schemeNames[i],
    "price": Random.integer(500, 2000),
    "保障项目": generateRandomProjects()
  };

  schemes.push(scheme);
}
// Mock 方案列表接口
Mock.mock(RegExp(baseURL+'//rest/insurance/detail' + '.*'), 'get', options => {
  return {
    status: 'success',
    code: 200,
    message: '获取保险方案列表成功',
    data: schemes
  };
});

let insurance = {
  "mid": "123",
  "descri": "健康保险 A",
  "issue": "发布时间",
  "name": "公司名",
  "genres": "类别",
  "price": 111111.111,
  "url": "链接",
  "status": "状态",
  "age": "年龄",
  "period": "周期",
  "scope": "承报范围"
}
let tags = ['实惠', '首选', '周期长', '年龄广']
// 用于接受生成数据的数组
let EveryInsurance = []
for (let i = 0; i < 40; i++) {
  let newObject = {
    mid: Mock.mock('@integer(1, 4)'),
    descri: Random.ctitle(2, 5) + '险',
    issue: Random.date() + ' ' + Random.time(),
    name: Random.ctitle(2, 5) + '公司',
    genres: Random.ctitle(2, 5),
    price: Mock.mock('@integer(100, 1000)'),
    url: "链接",
    status: Random.ctitle(2, 3),
    age: Mock.mock('@integer(1, 100)'),
    period: Mock.mock('@integer(1, 5)'),
    scope: "承报范围",
    heightlight: Random.ctitle(0, 5),
    hasDown: Mock.mock('@integer(0, 1)'),
    tag: Random.pick(tags, 1, 3),
    scheme: schemes
  }
  EveryInsurance.push(newObject)
}
//下面两组数据是测试根据兴趣是否可以正常推荐
let object = {
  mid: Mock.mock('@integer(1, 4)'),
  descri: Random.ctitle(2, 5) + '险',
  issue: Random.date() + ' ' + Random.time(),
  name: Random.ctitle(2, 5) + '公司',
  price: Mock.mock('@integer(100, 1000)'),
  url: "链接",
  status: Random.ctitle(2, 3),
  age: Mock.mock('@integer(1, 100)'),
  period: Mock.mock('@integer(1, 5)'),
  scope: "承报范围",
  heightlight: Random.ctitle(0, 5),
  hasDown: Mock.mock('@integer(0, 1)'),
  scheme: schemes,
  tag: Random.pick(tags, 1, 3),
  genres: "小额"
}
let object1 = {
  mid: Mock.mock('@integer(1, 4)'),
  descri: Random.ctitle(2, 5) + '险',
  issue: Random.date() + ' ' + Random.time(),
  name: Random.ctitle(2, 5) + '公司',
  price: Mock.mock('@integer(100, 1000)'),
  url: "链接",
  status: Random.ctitle(2, 3),
  age: Mock.mock('@integer(1, 100)'),
  period: Mock.mock('@integer(1, 5)'),
  scope: "承报范围",
  heightlight: Random.ctitle(0, 5),
  hasDown: Mock.mock('@integer(0, 1)'),
  scheme: schemes,
  tag: Random.pick(tags, 1, 3),
  genres: "大额"
}

EveryInsurance.push(object)
EveryInsurance.push(object1)

let tableList = {
  status: 'success',
  message: '获取热门列表成功',
  code: 200,
  data: {
    hotInsurances: EveryInsurance,
    recommendedInsurances: Random.pick(EveryInsurance, 4, 4),
    InsuranceList: EveryInsurance,
  },
}
let singleList = {
  status: 'success',
  message: '获取相关列表成功',
  code: 200,
  data: EveryInsurance
}
// 筛选
Mock.mock(baseURL+'/rest/insurance/screen', 'post', (params) => {
  //console.log("params", params);
  const {
    safeguard,
    type,
    priceRange
  } = JSON.parse(params.body);
  let filteredData = EveryInsurance;

  // 根据条件筛选
  if (safeguard && safeguard !== '全部') {
    filteredData = filteredData.filter(item => item.descri === safeguard);
  }

  if (type && type !== '全部') {
    filteredData = filteredData.filter(item => item.genres === type);
  }

  if (priceRange && priceRange.length === 2) {
    const [minPrice, maxPrice] = priceRange;
    //console.log("minPrice, maxPrice", minPrice, maxPrice);
    filteredData = filteredData.filter(item => item.price >= minPrice && item.price <= maxPrice);
  }

  //console.log("filteredData", filteredData);
  return {
    code: 200,
    status: 'success',
    message: '获取列表成功',
    data: {
      Insurances: filteredData,
    },
  };
});
// 获取所有类别
Mock.mock(baseURL+'/rest/insurance/allType', 'get', () => {
  // 模拟请求成功的情况，返回 EveryInsurance 中的 genres 数据
  const genresList = EveryInsurance.map(item => item.genres);
  const uniqueGenresList = Array.from(new Set(genresList)); // 去重
  return {
    code: 200,
    status: 'success',
    message: '获取类型列表成功',
    data: {
      types: ['全部', ...uniqueGenresList], // 添加 '全部' 到列表中
    },
  };
});
//获取所有保障
Mock.mock(baseURL+'/rest/insurance/allSafeguard', 'get', () => {
  // 模拟请求成功的情况，返回 EveryInsurance 中的 genres 数据

  const safeguardList = EveryInsurance.map(item => item.descri);

  const uniqueSafeguardList = Array.from(new Set(safeguardList)); // 去重
  return {
    code: 200,
    status: 'success',
    message: '获取类型列表成功',
    data: {
      safeguards: ['全部', ...uniqueSafeguardList],
    },
  };
});
//获取价格区间
Mock.mock(baseURL+'/rest/insurance/price', 'get', () => {
  // 获取 EveryInsurance 中的价格数组
  const prices = EveryInsurance.map(item => item.price);

  // 计算最大价格和最小价格
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  return {
    code: 200,
    status: 'success',
    message: '获取价格范围成功',
    data: {
      maxPrice,
      minPrice,
    },
  };
});
//根据兴趣进行推荐
Mock.mock(baseURL+'/rest/insurance/selectByInterest', 'post', (params) => {
  // 解析请求参数
  const interests = JSON.parse(params.body).interest;

  // 存储每个兴趣是否已经找到匹配的元素的标记
  const foundFlags = {};

  // 根据兴趣从 EveryInsurance 中筛选数据
  let filteredData = EveryInsurance.filter(item => {
    // 如果当前兴趣已经找到匹配的元素，则跳过
    for (const interest of interests || []) {
      if (foundFlags[interest]) {
        continue;
      }

      // 如果当前元素的兴趣匹配当前兴趣，则添加到结果中并标记为已找到
      if (item.genres === interest) {
        foundFlags[interest] = true;
        return true;
      }
    }

    // 如果没有找到匹配的元素，则不包含在结果中
    return false;
  });

  // 如果匹配到的数据小于 4，随机添加数据直到等于四
  while (filteredData.length < 4) {
    const randomItem = Random.pick(EveryInsurance);
    if (!foundFlags[randomItem.genres]) {
      filteredData.push(randomItem);
      foundFlags[randomItem.genres] = true;
    }
  }

  // 返回去重后的数据
  return {
    code: 200,
    data: Array.from(new Set(filteredData)), // 再次使用 Set 去重
    message: 'Success',
  };
});

Mock.mock(RegExp(baseURL+'/rest/orders/create-order' + '.*'), 'get', options => {
  // //console.log("id"+url.parse(options.url,true).query.id)
  let uid = Number(url.parse(options.url, true).query.uid)
  let mid = Number(url.parse(options.url, true).query.mid)

  let data = {
    "status": 'success',
    "code": 200,
    "message": "创建" + uid + '1' + mid + "成功",
  };
  return data;
})
Mock.mock(RegExp(baseURL+'/rest/orders/find-order' + '.*'), 'get', options => {
  // //console.log("id"+url.parse(options.url,true).query.id)
  let uid = Number(url.parse(options.url, true).query.uid)

  let data = {
    "success": true,
    "order": {
      "custormer_id": "222222",
      "insurance_id": "131231232312",
      "amount": "2222",
      "payment_type": "微信",
      "status": "未完成",
      "create_time": "2023-11-20 16:30:10",
      "code":"1231231231"
    },
  };
  return data;
})

Mock.mock(RegExp(baseURL+'/rest/insurance/wish' + '.*'), 'get', options => {
  let detail = [];
  for (let i = 0; i < 10; i++) {
    let item = {};
    let tags = [];
    for (let j = 0; j < Random.integer(0, 6); j++) {
      tags.push(Random.ctitle(1, 3));
    }
    item['tags'] = tags;
    item['mid'] = Mock.mock('@integer(1, 4)');
    item['descri'] = Random.ctitle(2, 5) + '险';
    item['issue'] = Random.date() + ' ' + Random.time();
    item['name'] = Random.ctitle(2, 5) + '公司';
    item['genres'] = Random.ctitle(2, 5);
    item['price'] = Mock.mock('@integer(100, 1000)');
    item['url'] = "链接";
    item['status'] = Random.ctitle(2, 3);
    item['age'] = Mock.mock('@integer(1, 100)');
    item['period'] = Mock.mock('@integer(1, 5)');
    item['scope'] = "承报范围";
    detail.push(item);
  };
  let data = {
    "status": 'success',
    "code": 200,
    "message": "获取热门列表成功",
    "data": {
      "recommendedInsurances": detail
    }
  };
  // 构造你的 detail
  return data;
})

Mock.mock(RegExp(baseURL+'/rest/users/history' + '.*'), 'get', options => {
  let id = Number(url.parse(options.url, true).query.id)
  let relationship = ['父母', '配偶', '本人']
  let detail = [];
  for (let i = 0; i < 3; i++) {
    let item = {};
    item['insuranceHolderName'] = Random.ctitle(2, 5)
    item['insuranceHolderLicenseType'] = '居民身份证'
    item['insuranceHolderIdNumber'] = Mock.mock('@integer(17, 18)')
    item['insuranceHolderPhoneNumber'] = Mock.mock('@integer(12, 13)')
    item['insuranceHolderIssue'] = Random.date() + ' ' + Random.time();
    item['insuranceHolderRemark'] = ''
    item['insuranceExceptName'] = Random.ctitle(2, 5)
    item['insuranceExceptLicenseType'] = '居民身份证'
    item['insuranceExceptIdNumber'] = Mock.mock('@integer(17, 18)')
    item['insuranceExceptPhoneNumber'] = Mock.mock('@integer(12, 13)')
    item['relationShip'] = relationship[i]
    item['insuranceExceptRemark'] = Random.ctitle(2, 5)
    detail.push(item);
  };
  let data = {
    "status": 'success',
    "code": 200,
    "message": "获取历史成功",
    "data": detail
  };
  // 构造你的 detail
  return data;
})
Mock.mock(RegExp(baseURL+'/rest/insurance/same' + '.*'), 'get', singleList)
Mock.mock(RegExp(baseURL+'/rest/insurance/search' + '.*'), 'get', tableList)
Mock.mock(RegExp(baseURL+'/rest/insurance/hot' + '.*'), 'get', tableList)
Mock.mock(RegExp(baseURL+'/rest/insurance/genres' + '.*'), 'get', tableList)
Mock.mock(RegExp(baseURL+'/rest/insurance/info' + '.*'), 'get', options => {
  // //console.log("id"+url.parse(options.url,true).query.id)
  let id = Number(url.parse(options.url, true).query.id)
  let ObjectInsurance = []
  for (let i = 0; i < EveryInsurance.length; i++) {
    //console.log("-" + EveryInsurance[i].mid === id)
    if (EveryInsurance[i].mid === id) {
      ObjectInsurance = EveryInsurance[i]
      break
    }
  }
  let data = {
    "status": 'success',
    "code": 200,
    "message": "获取" + id + "成功",
    "data": ObjectInsurance
  };
  return data;
})
// post请求分页
Mock.mock('/api/pageList', 'post', (params) => {
  //console.log(params, 'params')
  const [index, size, total] = [JSON.parse(params.body).page, JSON.parse(params.body).size, tableList.length]
  let len = total / size
  //console.log(index, size, total, 'index, size, total')
  const totalPages = len - parseInt(len) > 0 ? parseInt(len) + 1 : len
  // 截取list
  // const newProduceNewsData = tableList.slice(index * size, (index + 1) * size)
  const newProduceNewsData = tableList.slice((index - 1) * size, index * size)
  //console.log(newProduceNewsData, 'newProduceNewsData')
  return {
    code: '0',
    message: 'success',
    data: {
      page: index,
      size: size,
      list: newProduceNewsData,
      total: total,
      totalPages: totalPages
    }
  }
})

// 模拟发送验证码接口
Mock.mock(baseURL+'/api/msm/sendVerificationCode', 'post', (params) => {
  const {
    phoneNumber
  } = JSON.parse(params.body);

  // 模拟后端生成随机验证码
  const verificationCode = Mock.mock('@integer(100000, 999999)');
  //console.log("verificationCode", verificationCode);
  // 返回模拟的验证码数据
  return {
    code: 200,
    message: 'success',
    data: {
      phoneNumber: phoneNumber,
      verificationCode: verificationCode
    },
  };
});
let phoneNumberList = ['15684786518', '23456789012', '34567890123'];
Mock.mock(baseURL+'/api/user/loginWithPhoneCode', 'post', (params) => {
  const {
    phoneNumber,
    verificationCode
  } = JSON.parse(params.body);
  let action = phoneNumberList.includes(phoneNumber) ? "login" : "register";
  if (action === 'register') {
    phoneNumberList.push(phoneNumber)
    //console.log("phoneNumberList", phoneNumberList);
  }
  let message = phoneNumberList.includes(phoneNumber) ? '登陆成功' : '注册成功';
  if (phoneNumber && verificationCode) {
    return {
      code: 200,
      message: message,
      action: action,
      data: {
        token: phoneNumber,
        uid: phoneNumber,
      },
    };
  } else {

    return {
      code: '1',
      status: "error",
      message: '登录失败，手机号或验证码错误',
      data: null,
    };
  }
});
const AccountData = [{
    id: "abc123",
    code: "XY789Z"
  },
  {
    id: "def456",
    code: "AB123C"
  },
  {
    id: "ghi789",
    code: "CD456E"
  },
  {
    id: "123",
    code: "123"
  },
];
Mock.mock(RegExp(baseURL+'/rest/users/register'+'.*'), 'get', (params) => {
  let ID = url.parse(params.url, true).query.username
  let Code = url.parse(params.url, true).query.password
  AccountData.push({
    id: ID,
    code: Code
  });
  return {
    // code: 200,
    // message: '登录成功',
    // action: 'login',
    // data: {
    //   token: ID,
    //   uid: ID,
    // },
    success:true,}
})
Mock.mock(RegExp(baseURL+'/rest/users/login'+'.*'), 'get', (params) => {
  console.log(params.url)
  let ID = url.parse(params.url, true).query.username
  let Code = url.parse(params.url, true).query.password
  console.log("ID,Code", ID, Code);
  const existingAccount = AccountData.find(account => account.id === ID);
  console.log("existingAccount", existingAccount);
  if (existingAccount) {
    if (existingAccount.code === Code) {
      return {
        // code: 200,
        // message: '登录成功',
        // action: 'login',
        // data: {
        //   token: ID,
        //   uid: ID,
        // },
        success:true,
        user:{
          uid:3556498,
          username:ID,
          password:Code,
          first:true,
          timestamp:'13123',
          prefGenres:[],
        }
      };
    } else {
      return {
        // code: '1',
        // status: 'error',
        // message: '登录失败，密码错误',
        // data: null,
        success:false,
      };
    }
  } else {
    AccountData.push({
      id: ID,
      code: Code
    });

    return {
      success:true
      // code: 200,
      // message: '注册成功',
      // action: 'register',
      // data: {
      //   token: ID,
      //   uid: ID,
      // },
    };
  }
});

function generateRandomData() {
  // 函数用于生成随机的名称
  function generateRandomName() {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry'];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  }

  // 函数用于生成随机的证件类型
  function generateRandomCertificatesType() {
    const certificateTypes = ['Passport', 'ID Card', 'Driver\'s License'];
    const randomIndex = Math.floor(Math.random() * certificateTypes.length);
    return certificateTypes[randomIndex];
  }

  // 函数用于生成随机的证件号码
  function generateRandomCertificatesNo() {
    // 这里只是一个简单的示例，实际中可能需要更复杂的逻辑来生成合法的证件号码
    return Math.floor(Math.random() * 1000000000).toString();
  }

  // 函数用于生成随机的证件 URL
  function generateRandomCertificatesUrl() {
    // 这里只是一个简单的示例，实际中可能需要使用真实的 URL 或其他逻辑
    return 'https://example.com/certificate/' + Math.random().toString(36).substring(7);
  }

  // 生成随机数据
  const randomData = {
    name: generateRandomName(),
    certificatesType: generateRandomCertificatesType(),
    certificatesNo: generateRandomCertificatesNo(),
    certificatesUrl: generateRandomCertificatesUrl()
  };

  return randomData;
}
//获取实名信息
Mock.mock(baseURL+'/api/user/auth/getUserInfo', 'post', (options) => {
  const userId = JSON.parse(options.body);
  //console.log("userId", userId);
  const randomUserData = generateRandomData();
  return {
    code: 200,
    data: randomUserData,
    message: 'success'
  };
});

//获取实名信息
Mock.mock(baseURL+'/api/user/auth/userAuth', 'post', (options) => {
  const {
    userId,
    userAuth
  } = JSON.parse(options.body);
  //console.log("userId,userAuth", userId, userAuth);
  return {
    code: 200,
    message: 'success'
  };
});
