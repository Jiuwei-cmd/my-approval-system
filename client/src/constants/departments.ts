interface Option {
  value: string;
  label: string;
  children?: Option[];
}


export const options: Option[] = [
  {
    value: '产品部',
    label: '产品部',
    children: [
      {
        value: '技术部',
        label: '技术部',
        children: [
          {
            value: 'AI创新团队',
            label: 'AI创新团队',
          },
        ],
      },
    ],
  },
  {
    value: '运营部',
    label: '运营部',
    children: [
      {
        value: '采购部',
        label: '采购部',
        children: [
          {
            value: '后勤团队',
            label: '后勤团队',
          },
        ],
      },
    ],
  },
  {
    value: '品牌部',
    label: '品牌部',
    children: [
      {
        value: '数字营销部',
        label: '数字营销部',
        children: [
          {
            value: '增长黑客团队',
            label: '增长黑客团队',
          },
        ],
      },
    ],
  },
  {
    value: '人才发展部',
    label: '人才发展部',
    children: [
      {
        value: '学习中心',
        label: '学习中心',
        children: [
          {
            value: 'HRBP团队',
            label: 'HRBP团队',
          },
        ],
      },
    ],
  },
];