<script>
  export default {
    companyName: '浙江南华资本管理有限公司',
    letDate: {
      TypeOfDeposit: [{
          value: 0,
          label: "出入金"
        },
        {
          value: 1,
          label: "抛补出入金"
        },
        {
          value: 2,
          label: "投资收益、支出"
        },
        {
          value: 3,
          label: "抛补收益、支出"
        },
        {
          value: 4,
          label: "在途资金变动"
        },
        {
          value: 5,
          label: "客户授信额度变动"
        },
        {
          value: 6,
          label: "客户资金账户与抛补资金账户，资金切换"
        },
        {
          value: 7,
          label: "客户日内授信额度变更"
        },
        {
          value: 8,
          label: "利息收益"
        },
      ],
      journalTypeSel: [ //客户资金流水类型
        {
          value: 0,
          label: "客户出入金"
        },
        {
          value: 1,
          label: "投资支出"
        },
        {
          value: 2,
          label: "投资收益"
        },
        {
          value: 3,
          label: "利息收入"
        },
        {
          value: 4,
          label: "抛补出入金"
        },
        {
          value: 5,
          label: "抛补收益"
        },
        {
          value: 6,
          label: "代收手续费"
        },
        {
          value: 7,
          label: "客户出金冻结可用资金"
        },
        {
          value: 8,
          label: "客户出金拒绝释放冻结资金"
        },
        {
          value: 9,
          label: "扣除客户出金冻结资金"
        },
        {
          value: 10,
          label: "客户在途资金变动"
        },
        {
          value: 11,
          label: "客户保证金授信额度变动"
        },
        {
          value: 12,
          label: "易利权资金转入账户余额"
        },
        {
          value: 13,
          label: "修改占用资金"
        },
        {
          value: 1004,
          label: "冻结可用资金"
        },
        {
          value: 1005,
          label: "释放冻结资金"
        },
        {
          value: 1006,
          label: "冻结资金转支出"
        },
        {
          value: 1007,
          label: "冻结资金转保证金"
        },
        {
          value: 1008,
          label: "保证金追缴"
        },
        {
          value: 1009,
          label: "保证金追缴"
        },
        {
          value: 1010,
          label: "释放保证金"
        },
        {
          value: 1011,
          label: "账户收益"
        },
        {
          value: 1012,
          label: "冲账"
        },
        {
          value: 1013,
          label: "抛补账户收益"
        },
        {
          value: 1014,
          label: "抛补账户冲账"
        },
        {
          value: 1015,
          label: "委托单冻结权利金"
        },
        {
          value: 1016,
          label: "委托单释放冻结权利金"
        },
        {
          value: 1017,
          label: "委托单冻结保证金"
        },
        {
          value: 1018,
          label: "委托单释放冻结保证金"
        },
        {
          value: 1019,
          label: "委托单冻结权利金不足本次成交权利金额度"
        },
        {
          value: 1020,
          label: "委托单冻结保证金不足本次保证金额度"
        }
      ],
      journalType: [ //客户资金流水可选择的类型
        {
          value: 0,
          label: "客户出入金"
        },
        {
          value: 1,
          label: "投资支出"
        },
        {
          value: 2,
          label: "投资收益"
        },
        {
          value: 3,
          label: "利息收入"
        },
        {
          value: 4,
          label: "抛补出入金"
        },
        {
          value: 5,
          label: "抛补收益"
        },
        {
          value: 10,
          label: "在途资金"
        },
        {
          value: 11,
          label: "保证金授信"
        },
        {
          value: 12,
          label: "易利权出入金",
          disabled: true
        },
        {
          value: 1015,
          label: "委托单冻结权利金",
          disabled: true
        },
        {
          value: 1016,
          label: "委托单释放冻结权利金",
          disabled: true
        },
        {
          value: 1617,
          label: "委托单冻结保证金",
          disabled: true
        },
        {
          value: 1018,
          label: "委托单释放冻结保证金",
          disabled: true
        }
      ],
      options: [{
        value: 65,
        label: '法人'
      }, {
        value: 67,
        label: '产品'
      }, {
        value: 68,
        label: '个人'
      }, {
        value: 70,
        label: '金融法人'
      }], //客户类型
      agreementSel: [{
        value: -1,
        label: "审批失败"
      }, {
        value: 0,
        label: "未审批"
      }, {
        value: 1,
        label: "审批通过"
      }], //审批状态
      executionStateSel: [{
        value: -1,
        label: "执行失败"
      }, {
        value: 0,
        label: "未执行"
      }, {
        value: 1,
        label: "执行成功"
      }], //执行状态
      options1: [ //客户等级类型
        {
          value: -1,
          label: '无'
        },
        {
          value: 0,
          label: 'C4'
        },
        {
          value: 1,
          label: 'C5'
        },
        {
          value: 2,
          label: '专业投资者'
        }
      ],
      options4: [ //保证金类型
        {
          value: 0,
          label: '普通'
        },
        {
          value: 1,
          label: '特殊'
        },
        {
          value: 2,
          label: '上海筑欣'
        },
        {
          value: 3,
          label: '大商所优化'
        },
        {
          value: 4,
          label: 'DELTA'
        },
        {
          value: 5,
          label: '权益类'
        }
      ],
      options5: [ //行业类型
        {
          value: 0,
          label: '农、林、牧、渔业'
        },
        {
          value: 1,
          label: '采矿业'
        },
        {
          value: 2,
          label: '电力、燃气和水的生产和供应业'
        },
        {
          value: 3,
          label: '建筑业'
        },
        {
          value: 4,
          label: '交通运输、仓储和邮政业'
        },
        {
          value: 5,
          label: '信息传输、计算机服务和软件业'
        },
        {
          value: 6,
          label: '批发和零售业'
        },
        {
          value: 7,
          label: '住宿和餐饮业'
        },
        {
          value: 8,
          label: '金融业'
        },
        {
          value: 9,
          label: '房地产业'
        },
        {
          value: 10,
          label: '租赁和商务服务业'
        },
        {
          value: 11,
          label: '科学研究、技术服务和地质勘查业'
        },
        {
          value: 12,
          label: '居民服务和其他服务业'
        },
        {
          value: 13,
          label: '教育'
        },
        {
          value: 14,
          label: '卫生、社会保障和社会福利业'
        },
        {
          value: 15,
          label: '文化、体育和娱乐业'
        },
        {
          value: 16,
          label: '公共管理和社会组织'
        },
        {
          value: 17,
          label: '国际组织'
        }
      ],
      options6: [{
          value: 0,
          label: '境内期货交易所'
        },
        {
          value: 1,
          label: '大宗商品电子交易市场'
        },
        {
          value: 2,
          label: '境外期货交易所'
        },
        {
          value: 3,
          label: '金融机构'
        },
        {
          value: 4,
          label: '实体企业'
        },
        {
          value: 5,
          label: '其他'
        }
      ],
      options7: [{
        value: 0,
        label: '普通'
      }],
      tradeTypeSel: [{
          value: 0,
          label: '期货账号'
        },
        {
          value: 1,
          label: '股票账号'
        },
        {
          value: 2,
          label: '黄金账号'
        }
      ],
      tradeSettlementTypeSel: [{
          value: 0,
          label: '金仕达结算单类型'
        },
        {
          value: 1,
          label: 'CTP结算单类型'
        },
        {
          value: 2,
          label: '股票结算单类型'
        },
        {
          value: 3,
          label: '黄金结算单类型'
        }
      ],
      optionsTypeSel: [{
          value: 0,
          label: '普通期权'
        },
        {
          value: 1,
          label: '美式期权'
        },
        {
          value: 2,
          label: '类美式期权'
        },
        {
          value: 100,
          label: '未知期权'
        },
        {
          value: 200,
          label: '标准障碍式期权'
        },
        {
          value: 300,
          label: '标准亚式期权'
        },
        {
          value: 400,
          label: '二元期权'
        },
        {
          value: 500,
          label: '双重障碍式期权'
        }
      ],
      notionalPrincipalTypeSel: [{
          value: 0,
          label: '报价单位计量'
        },
        {
          value: 1,
          label: '年化名义本金类'
        },
        {
          value: 2,
          label: '非年化名义本金类'
        }
      ],
      groupTypeSel: [{
          value: 0,
          label: '普通的单个期权'
        },
        {
          value: 1,
          label: '垂直价差组合'
        },
        {
          value: 2,
          label: '跨式组合'
        },
        {
          value: 3,
          label: '风险逆转组合'
        }
      ],
      contractTypeSel: [{
          value: 0,
          label: '普通单'
        },
        {
          value: 1,
          label: '反向单'
        }
      ],
      proxyPhoneNumberSel: [{
          value: '厉浩昊87001700',
          label: '厉浩昊87001700'
        },
        {
          value: '唐超87839253',
          label: '唐超87839253'
        },
        {
          value: '柯柯85195671',
          label: '柯柯85195671'
        }
      ],
      volatilityCalTypeSel: [{
          value: 0,
          label: '市价衰减'
        },
        {
          value: 1,
          label: '市价固定理论'
        },
        {
          value: 2,
          label: '市价固定成交'
        }
      ],
      optionsSettlementTypeSel: [{
          value: 0,
          label: '每日结算和到期结算都使用收盘价'
        },
        {
          value: 1,
          label: '每日结算使用收盘价,到期结算使用结算价'
        },
        {
          value: 2,
          label: '每日结算和到期结算都使用结算价'
        },
        {
          value: 3,
          label: '每日结算使用收盘价,到期结算使用自定义价'
        },
        {
          value: 4,
          label: '每日结算使用结算价,到期结算使用自定义价'
        },
        {
          value: 5,
          label: '每日结算和到期结算都使用自定义价'
        }
      ],
      exoticTypeSel: {
        "0": [],
        "1": [],
        "2": [],
        "100": [],
        "200": [{
          value: 0,
          label: '上升敲入'
        }, {
          value: 1,
          label: '上升敲出'
        }, {
          value: 2,
          label: '下降敲入'
        }, {
          value: 3,
          label: '下降敲出'
        }],
        "300": [{
          value: 1,
          label: '平均价格'
        }, {
          value: 2,
          label: '平均执行价'
        }],
        "400": [{
          value: 0,
          label: '现金或无类型'
        }, {
          value: 1,
          label: '资产或无类型'
        }],
        "500": [{
          value: 0,
          label: '双边敲入'
        }, {
          value: 1,
          label: '双边敲出当日赎回'
        }, {
          value: 2,
          label: '双边敲出到期赎回'
        }]
      },
      rpTypeSel: [{
          value: 0,
          label: '合约价值限额'
        },
        {
          value: 1,
          label: 'Delta限制金额最小值'
        },
        {
          value: 2,
          label: 'Delta限制金额最大值'
        },
        {
          value: 3,
          label: 'Delta暴险金额'
        },
        {
          value: 4,
          label: 'Theta暴险金额正'
        },
        {
          value: 5,
          label: 'Theta暴险金额负'
        },
        {
          value: 6,
          label: 'Vega暴险金额'
        }
      ],
      permissScopeSel: [{
          value: '11',
          label: '全部辖区权限全部子账权限'
        },
        {
          value: '10',
          label: '全部辖区权限部分子账权限'
        },
        {
          value: '01',
          label: '部分辖区权限全部子账权限'
        },
        {
          value: '00',
          label: '部分辖区权限部分子账权限'
        }
      ]
    },
    // url:' https://www.easy-mock.com/mock/5cd125e7f13c0f52e6147e8e',
    url: 'https://biz.nanhuacapital.com/tm_gm/',
    nav: [{
      name: '用户权限管理',
      children: [{
        name: '本地用户维护',
        path: '/localUser/1'
      }, {
        name: 'OA用户维护',
        path: '/localUser/2'
      }, {
        name: '角色维护',
        path: '/PFCG'
      }, {
        name: '许可维护',
        path: '/PTM'
      }, ]
    }, {
      name: 'web客户端管理',
      children: [{
        name: '查看web端所有客户',
        path: '/allClient'
      }, {
        name: '审核客户绑定',
        path: '/audit'
      }, {
        name: '查看审核记录',
        path: '/seeAudit'
      }, ]
    }, {
      name: '客户信息管理',
      path: '',
      children: [{
        name: '银行信息管理',
        path: '/bank'
      }, {
        name: '部门信息管理',
        path: '/section'
      }, {
        name: '辖区信息管理',
        path: '/area'
      }, {
        name: '客户基本资料 ',
        path: '/clientDetails'
      }, ]
    }, {
      name: '客户资金管理',
      path: '',
      children: [{
        name: '客户资金账户',
        path: '/capitalAccount '
      }, ]
    }, {
      name: '报价配置管理',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '委托单管理',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '成交单管理',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '监控管理',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '结算管理',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '部门报表',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '营销统计',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '财务统计',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '营业部统计',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '报送监管机构',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '发送客户报表',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '日志管理',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '运维管理',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }, {
      name: '客户意见反馈',
      path: '',
      children: [{
        name: '',
        path: ''
      }, ]
    }]
  }
</script>