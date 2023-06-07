# 使用 TypeScript 的竅門

- [使用 TypeScript 的竅門](#使用-typescript-的竅門)
  - [想要快速查看元件有哪些 props 可以傳入？](#想要快速查看元件有哪些-props-可以傳入)
  - [比 string 更精確的 Union Type](#比-string-更精確的-union-type)
    - [這樣做有什麼好處？](#這樣做有什麼好處)
    - [補充：也可以用 Enum 來改寫](#補充也可以用-enum-來改寫)
  - [怎麼看某個 props 的型別是什麼？](#怎麼看某個-props-的型別是什麼)
  - [善用泛型避免 any 型別](#善用泛型避免-any-型別)
  - [有些時候你可能不需要自己手刻每個型別（typeof \& Type-Inference）](#有些時候你可能不需要自己手刻每個型別typeof--type-inference)
    - [實際範例](#實際範例)
  - [當某個 props 是 optional，但又希望有預設值？](#當某個-props-是-optional但又希望有預設值)
  - [利用 keyof 取出物件的 key](#利用-keyof-取出物件的-key)
  - [用更聰明的方式來設定物件的 key（Mapped Type \& Index Signatures）](#用更聰明的方式來設定物件的-keymapped-type--index-signatures)
    - [實戰練習](#實戰練習)
  - [Bonus：好物推薦](#bonus好物推薦)

## 想要快速查看元件有哪些 props 可以傳入？

當你懶得爬官方文件時這招很方便。只要按下 `Command + i` 就會彈出所有可傳入的 props 給你參考，像這樣：

![check-type-of-props](/README-images/trigger-suggest-1.gif)

或者是想查看一個 props 可傳入哪些值的時候也可以用（我自己最常用來看有哪些 Union Type）：

![trigger-suggest-2](/README-images/trigger-suggest-2.gif)

> 註：這個功能在 VSCode 裡面叫做「Trigger Suggest」，如果要改快捷鍵可以用這個關鍵字去搜尋。

## 比 string 更精確的 Union Type

這通常會用在**你已經確定好某一個 string 型別的值有哪些**時會用到，例如下面這個例子：

![view-edit-state](/README-images/view-edit-state.gif)

這邊可以看到 Modal 中有兩個狀態，分別是「閱讀（view）」和「編輯（edit）」。

如果我們想要用 `useState` 來儲存狀態的話，與其用一個很廣義的 `string` 來設定：

```typescript
const DetailModal = () => {
  const [mode, setMode] = useState<string>('view')
}
```

我更建議用「Union Type」的方式來設定：

```typescript
const DetailModal = () => {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
}
```

### 這樣做有什麼好處？

1\. 看到這段 code 的人會馬上知道這邊有 view 跟 edit 的狀態，不用自己盲猜，減少錯誤率。（我自己就曾經在改別人的 code 改到後面時才發現還有其他狀態...）

2\. 如果在更新 state 時不慎寫錯值，TS 會馬上告訴妳這邊有問題，不用擔心。

![union-error](/README-images/union-error.png)

註：TS 說這邊只能傳入 `view` 或 `edit`，`create` 是不行的。

### 補充：也可以用 Enum 來改寫

這邊只是補充另外一個方法，不過你必須自己去了解一下 Enum 的用法，這邊不會解釋太多。詳細可以參考 [TS 官方文件](https://www.typescriptlang.org/docs/handbook/enums.html)。

剛剛的例子也可以用 Enum 來改寫成這樣：

```typescript
enum ModalState {
  VIEW = 'view',
  EDIT = 'edit'
}

const DetailModal = () => {
  const [mode, setMode] = useState<ModalState>(ModalState.VIEW)

  function changeToEdit() {
    setMode(ModalState.EDIT)
  }

  function changeToView() {
    setMode(ModalState.VIEW)
  }
}
```

## 怎麼看某個 props 的型別是什麼？

不知道你有沒有碰過這種情境，就是當某個 props 內容很冗長的時候，會想要把它抽出去寫成一個獨立的 variable 或 function，例如下面是一個 Antd Design 的 `<Select>` 元件：

```typescript
<Select
  options={[
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 }
  ]}
/>
```

這時候如果想把 `options` 的部分抽出去寫的話，你可能會這樣寫：

```typescript
const myOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 }
]

<Select options={myOptions} />
```

> 看起來很正常啊，這樣子有什麼問題嗎？

確實看起來沒什麼問題，但你有注意到這邊的 `myOptions` 其實沒有型別限制嗎？也就是說你想放什麼在裡面都可以，像是：

```typescript
const myOptions = [
  { label: '1', value: 1, a: 'a' },
  { label: '2', value: 2, b: 'b' },
  { label: '3', value: 3, c: 'c' },
  { label: '4', value: 4, d: 'd' },
  { label: '5', value: 5, e: 'e' }
]
```

你要放任何奇怪的東西都沒有人會阻止你，因為我們本來就沒有告訴 TS 說「 `myOptions` 的型別應該要長什麼樣子？」

註：雖然以這個例子來說你真的這樣寫也不會出現型別錯誤（抱歉 R，舉了個爛例子），但還是不推薦這樣寫。

比較好的做法是把 `myOptions` 加上正確的型別，來確保內容真的有符合 `<Select>` 的 `option` 型別。

> 好哦，那我要怎麼知道 `<Select>` 的 `option` 的型別是什麼？

其實很簡單，你只要先透過 `hover` 的方式來查看，再透過 VSCode 的 auto import 來引入就可以拿到正確的型別了，參考下面的示範：

![check-type-of-props](/README-images/check-type-of-props.gif)

很簡單吧，就真的只有兩步而已：

1. hover 看型別
2. 把型別複製貼上後用 auto import 引入進來

這樣子就可以確保型別是正確的，而且還有「型別提示」的好處，像這樣：

![auto-suggestion](/README-images/auto-suggestion.gif)

我很喜歡這種提示的功能，因為看到提示你就可以確保這是「可以放的東西」，不用擔心會不會放錯東西（除非定義型別的人寫錯，但我自己還沒有遇過就是了）。

## 善用泛型避免 any 型別

這邊會拿 Antd Design 中的 `useForm` 來做舉例，如果你不知道 `useForm` 的用法，請參考[官方範例](https://codesandbox.io/s/heosjv)。

在你還不熟泛型之前，你可能會這樣子去用它：

```typescript
const FormComponent = (props: FormComponentProps) => {
  const [form] = useForm()

  <Form form={form}>
    {/* 略... */}
  </Form>
}
```

這樣子做有什麼問題？如果你試著用 `form.getFieldsValue()` 的話就會發現拿到的型別是 `any`：

![any-type](/README-images/any-type.png)

當你看到 `any` 的時候可以懷疑一下「是不是有哪裡的型別沒設定好」，因為大多數情況下 `any` 只該出現在特定場景（例如 `error`，或是~~在趕專案的同事~~~）。

以這個例子來說的話，原因是出在 `useForm` 在使用的時候其實是可以傳入泛型的，像這樣：

```typescript
const [form] = useForm<formData>()
```

到這邊可能你會想問：「不對啊，你是怎麼知道這件事的？！」

其實也沒什麼，我也只是先透過 hover 來確認好 `useForm` 的型別而已，沒有特別去查官方文件或是 Google 或 ~~ChatGPT~~，就是多觀察而已。

在 hover 的時候可以看到像這樣的畫面：

![check-type-by-hover](/README-images/check-type-by-hover.png)

接著仔細看這一段：

```typescript
useForm<any>(form?: FormInstance<any> | undefined): [FormInstance<any>]
```

能看到它告訴你 `useForm` 可以傳入一個泛型（預設為 `<any>`），且這個泛型會對應到 `FormInstance<any>`（也就是回傳值拿到的 `[form]`），所以應該不難聯想到這裡的泛型是用來設定表單實體的型別（就是表單內容啦），我只是試試看以後就發現確實是這樣子！

所以現在如果把 code 改成像這樣的話：

```typescript
type formData = {
  title: string
  description: string
  rate: number
}

function App() {
  const [form] = useForm<formData>()

  function handleSubmit() {
    const data = form.getFieldsValue()
  }
}
```

就不會再出現 any 型別，而是正確的表單值：

![add-type-to-useFrom](/README-images//add-type-to-useFrom.png)

這樣子你在操作表單的時候就能清楚知道有哪些值可以用。

## 有些時候你可能不需要自己手刻每個型別（typeof & Type-Inference）

這邊要先認識兩個東西，一個是關鍵字 `typeof`，一個是 Type-Inference 的觀念。

我們先來看 Type-Inference 是什麼，其實只有一句話：

> 自動幫你推導出型別。

例如說你寫 `useState` 的時候，就算沒有指定好型別，TS 也會自動幫你推導出來：

```typescript
const [name, setName] = useState('') // name 的型別會自動推導為 string
const [age, setAge] = useState(0) // age 的型別會自動推導為 string
const [isMarried, setIsMarried] = useState(false) // isMarried 的型別會自動推導為 boolean
```

如果是物件的話，TS 也一樣會幫你推導出來：

![type-inference](/README-images/type-inference.png)

知道這個後可以做什麼呢？別急嘛，我們先來看 `typeof` 是什麼。

如果你寫過 JS 的話應該對這個詞不陌生，它是用來檢查一個變數的型別，像這樣：

```javascript
const name = 'PeaNu'
const id = 484
const areYouKiddingMe = false

console.log(typeof name) // 'string'
console.log(typeof id) // 'number'
console.log(typeof areYouKiddingMe) // 'boolean'
```

沒有什麼，就是你在熟悉不過的東西，但不是今天的重點。

重點是 TS 裡面也有一個 `typeof`，我們可以用它來「萃取出某一個變數的型別」。什麽意思？來看個範例。

假設有一個變數長這樣：

```typescript
const person = {
  name: string
  age: number
  isMarried: boolean
}
```

接著我就可以用 `typeof` 去萃取出 `person` 的型別：

![typeof-useage](/README-images/typeof-useage.png)

這樣子就~~免費~~獲得一個 `person` 的型別了！但我希望你注意到這邊的每一步流程是這樣子：

1. `person` 先透過 Type-Inference 自動推導出 `{name: string, ...}` 這個型別
2. 利用 typeof 把 `person` 的型別給萃取出來，丟給 `PersonType`

希望這邊能讓你理解 `typeof` 跟 Type-Inference 的概念是什麼。

我知道你可能還是想問「所以知道這些以後可以幹嘛？」，所以下面來看個實際範例吧。

### 實際範例

這邊想先說一下，其實我覺得 `typeof` 真正實用的地方是用在寫 utility types 的時候。至於什麼是 utility types？請容我直接節錄一段 [pjchender 大大](https://ithelp.ithome.com.tw/articles/10269471) 的說明：

> 一般寫程式時，或多或少會寫過一些 utility function，它們就像小工具，可以接受 input 然後做了某些處理後回傳 output，舉例來說，以阿拉伯數字作為 input，接著以中文的數字作為 output；或者以字串作為 input，根據某些字元拆成陣列後作為 output。不管功能是什麼，這種「小工具」類，有 input 和 output 的函式，就可以稱作 utility。

> 除了函式之外，在 TypeScript 中，也有不少處理型別的小工具可以使用，和前面提到的 utility functions 最大的不同在於，代入 Utility Types 的 input 會是 TypeScript 的「型別」，而不是一般的 JavaScript value，也就是說，Utility Types 會以「型別」作為 input，並且以另一個「型別」作為 output，也就是說，Utility Types 就像函式一樣可以帶入 input 得到 output，透過 Utility Types 將可以「根據一個型別，來建立出另一個型別」。

簡單來說就是「根據一個型別，來建立出另一個型別」這個意思，不過我這邊不打算拿 utility types 來當做範例，因為會延伸到其他觀念，所以這邊只會做一個比較簡單示範，只是還是想特別補充一下 `typeof` 其實主要是做 utility types 很方便的東西。

這邊會用 Ant Design 的 `<Form>` 來做一個示範，假設我們目前有這樣的 code：

```typescript
const FormComponent = () => {
  const initialData = useRef({
    name: '',
    age: 0,
    isMarried: false
  })

  function handleSubmit(values: any) {
    console.log(values)
  }

  return (
    <Form initialValues={initialData} onFinish={handleSubmit}>
      <Form.Item name='name' label='Name'>
        <Input />
      </Form.Item>
      <Form.Item name='age' label='Age'>
        <InputNumber />
      </Form.Item>
      <Form.Item name='isMarried' label='Married'>
        <Select />
      </Form.Item>
    </Form>
  )
}
```

就是一個簡單的表單而已，不過請注意到 `handleSubmit` 的部分。

一般我們會希望 `handleSubmit` 中的 `values` 有一個正確的型別，避免去存取到錯誤的東西，所以可能就會寫一個型別來給 `values` 用，這個型別也可以順便給 `initialData` 使用，像這樣：

```typescript
type FormDateType = {
  name: string
  age: name
  isMarried: boolean
}

const FormComponent = () => {
  // 加上型別
  const initialData = useRef<FormDateType>({
    name: '',
    age: 0,
    isMarried: false
  })

  // 加上型別
  function handleSubmit(values: FormDateType) {
    console.log(values)
  }

  // 略...
}
```

不過如果套用剛剛的 `typeof` 跟 Type-Inference 的概念，我們其實不需要自己手刻出 `FormDateType` 這個型別，只要這樣做就好：

```typescript
const FormComponent = () => {
  const initialData = useRef({
    name: '',
    age: 0,
    isMarried: false
  })

  // 利用 Type-Inference 的特性搭配 typeof 來萃取出型別
  function handleSubmit(values: typeof initialData.current) {
    console.log(values)
  }

  // 略...
}
```

如果你用 hover 來檢查一下就會發現跟剛剛是一模一樣的：

![typeof-demo](/README-images/typeof-demo.png)

所以下次當你懶的自己建立型別時，就可以像這樣子觀察看看是不是有現成的型別能用，再搭配 `typeof` 來萃取，我覺得這會是一個蠻省時間的做法。

## 當某個 props 是 optional，但又希望有預設值？

這個是我當初在處理元件 `props` 蠻常遇到的情境，一樣先來看段 code:：

```typescript
type FormComponentProps = {
  initialData: FormData
  buttonPosition?: 'top' | 'bottom'
  submitButtonText?: string
  showCancelButton?: boolean
  onSubmit: (values: FormData, form: FormInstance<FormData>) => void
  onCancel?: () => void
}

const FormComponent = (props: FormComponentProps) => {
  const { onSubmit, onCancel, initialData, buttonPosition, submitButtonText, showCancelButton } =
    props

  // 略...
}
```

這是一個表單區塊的元件，實際大概長得像這樣子：

![form-component-screenshot](/README-images/form-component-screenshot.png)

我特別把按鈕的部分用紅線給框起來，是因為從前面的 `FormComponentProps` 應該能注意到有一些項目是「可選的」，如下：

- `buttonPosition` 用來決定按鈕要放在表單最上面還是最下面
- `submitButtonText` 用來設定提交按鈕的文字內容
- `showCancelButton` 是否顯示取消按鈕
- `onCancel` 取消按鈕的點擊事件 handler（因為取消按鈕不一定會顯示）

通常我們會想把一個 `props` 設為 optional 的原因是不希望在使用元件時要傳入這麼多 `props`。舉例來說，我們不會想在用 `FormComponent` 的時候要寫這麼多東西：

```typescript
<FormComponent
  buttonPosition='bottom'
  submitButtonText='Save'
  initialData={data}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  showCancelButton
/>
```

像 `buttonPosition` 或 `showCancelButton` 這種屬性等等都可以加上預設值，讓我們只要填必要的東西就好：

```typescript
<FormComponent initialData={data} onSubmit={handleSubmit} />
```

那要怎麼加上預設值呢？這就要考你對 ES6 [解構賦值](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#default_value) 的熟悉度了，答案是這樣子：

```typescript
const FormComponent = (props: FormComponentProps) => {
  const {
    onSubmit,
    onCancel = () => undefined,
    initialData,
    buttonPosition = 'top',
    submitButtonText = 'Add',
    showCancelButton = false
  } = props

  // 略...
}
```

或者是你喜歡直接在 function 的參數裡面解構也是可以的：

```typescript
const FormComponent = ({
  onSubmit,
  onCancel = () => undefined,
  initialData,
  buttonPosition = 'top',
  submitButtonText = 'Add',
  showCancelButton = false
}: FormComponentProps) => {
  // 略...
}
```

總之想用哪一種都可以，但我是比較偏好第一種方式啦，我覺得這樣子比較好讀。

其實這邊只是想介紹預設值必須透過解構賦值來處理而已，因為我當初還真的不知道該怎麼用...

## 利用 keyof 取出物件的 key

前面有介紹過 `typeof`，現在再多介紹一個 `keyof`。`keyof` 跟 `typeof` 的差別在於 `keyof` 是用在「型別」上，`typeof` 是用在「某個值」上，例如說：

```typescript
const person = { name: 'Hello' }
type PersonType = typeof person // 用在 person 這個 "值" 身上
type PersonKeys = keyof PersonType // 用在 PersonType 這個 "型別" 身上
```

知道這個可以做什麼？我們留到下一段再來討論。這邊你只要先知道 `keyof` 可以用來「把一個物件的 key 給拿出來變成一個『Union Type』」就好，像這樣：

![keyof-useage](/README-images/keyof-useage.png)

這樣子 `PersonKeys` 就會變成 `"name" | "age" | "isMarried"` 這個 Union Type，不過眼尖的話能應個會發現 `keyof PersonType` 還後面多了一段 `& string` 這個東西，這是什麼？

這邊要先解釋一個概念，就是一個物件的 key 其實可以是三種東西，分別為：

- `string`
- `number`
- `symbol`

![keyof-any](/README-images/keyof-any.png)

所以用 `keyof` 的時候如果沒有用 `&` 來告訴 TS「這邊的 key 都是 `string`」的話，它是沒辦法確定的，你在用 hover 看型別的時候就不會顯示出 `"name" | "age" | "isMarried"`，而是 `keyof PersonType`：

![keyof-without-modifier](/README-images/keyof-without-%26.png)

雖然這其實不會影響使用，但我自己比較喜歡在 hover 的時候就能看到所有值，所以會習慣加上 `& string` 來處理。

## 用更聰明的方式來設定物件的 key（Mapped Type & Index Signatures）

先恭喜讀到這邊的你，這是最後一個段落了，同時也是這篇文章中最複雜的一個段落（但也沒真的到很複雜啦），因為我覺得這是蠻實用的一招，所以想特別分享一下，希望各位會喜歡！

這邊的範例會運用前面所學的東西來做一個示範，包含：

- 怎麼查看跟引入某個套件的 props 型別（[傳送門](#怎麼看某個-props-的型別是什麼？)）
- 怎麼用 `keyof` 取值（[傳送門](#利用-keyof-取出物件的-key)）

忘記的話可以回去複習一下，沒問題的話就接著開始吧！

首先我們先介紹一下什麼叫做「Mapped Type（或 Index Signatures）」。

這東西基本上是這樣子用的：

```typescript
type DemoType = { [key in 'name' | 'nickname' | 'interesting']: string }

const demoObject: DemoType = {
  name: 'PeaNu Xue',
  nickname: 'coding',
  interesting: 'peaNu'
}
```

我們先來看比較複雜的部分：`[key in 'name' | 'nickname' | 'interesting']`

首先整個 `[]` 中的部分是來「設定物件的 key 值」用的，這就跟你在 JS 創造物件的時候一樣，你應該知道 `key` 其實是可以用 `[]` 給包起來：

```javascript
const demoObject = {
  ['name']: 'PeaNu Xue',
  ['nickname']: 'coding',
  ['interesting']: 'peaNu'
}
```

註：通常會用到 `[]` 的時機是要做 dynamic key 的時候會用到，但這邊為了方便就不舉太複雜的例子了，總之要知道 `[]` 是可以這樣子用的就好。

接著是 `in` 這個關鍵字，這是一個用來「iterable（迭代）」的關鍵字，換句話就是把 `in` 後面的東西給 loop 一遍的意思。所以 `in 'name' | 'nickname' | 'interesting'` 的意思就是：

1. 拿到 name 這個值
2. 拿到 nickname 這個值
3. 拿到 interesting 這個值

這個其實在 JS 的 `for` 迴圈也有類似的東西，叫做 [for..in](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/for...in)，它的用法是這樣子：：

```javascript
const demoObject = {
  name: 'PeaNu Xue',
  nickname: 'coding',
  interesting: 'peaNu'
}

for (const key in demoObject) {
  console.log(key)
  // 輸出結果會是：
  // 1. name,
  // 2. nickname
  // 3. interesting
}
```

所以 `[key in 'name' | 'nickname' | 'interesting']` 的概念就跟這個差不多，希望不會太難理解。

知道這些以後再回頭來看整個型別：

```typescript
type DemoType = { [key in 'name' | 'nickname' | 'interesting']: string }
```

前面的部分剛剛已經解釋過了，而後面的 `... : string` 其實就是說「每個 key 對應到的值是 `string`」，這樣子而已，所以整個組合起來的意思是：

- 第一個 key 是 name，值為 string
- 第二個 key 是 nickname，值為 string
- 第三個 key 是 interesting，值為 string

註：這邊的**先後順序**是沒有限制的，誰要在前誰要在後都可以，這邊只是為了解釋才這樣說明。

所以套用了這個型別的變數就一定要符合這個條件，不然就會出現錯誤訊息：

![mapped-type-error](/README-images/mapped-type-error.png)

註：意思是 `DemoType` 中有 `name`、`nickname`、`interesting` 三個 key，但我們漏掉了 `interesting`。

總結來說，Mapped Type 就是一個讓我們可以用比較 dynamic 的方式去處理物件的 `key` 跟 `value` 的一種操作方式，在寫 Utility types 的時候非常多時候會用到它！

到這邊為止，你應該對 Mapped Type 稍微有一點認識了，接下來就讓我們用一個範例說明這東西實際可以用在哪裡吧！

### 實戰練習

這邊一樣會拿 Antd Design 的元件來做舉例，這次是 `<Form.Item>` 這個元件，我們一樣先來看 code：

```typescript
const FormComponent = () => {
  return (
    <Form>
      <Form.Item
        name='title'
        label='Title'
        rules={[
          {
            required: true,
            message: 'Title cannot be blank.'
          }
        ]}
      ></Form.Item>
      <Form.Item name='rate' label='Rate'>
        <Select className='w-full' options={starsOption} />
      </Form.Item>
      <Form.Item
        name='description'
        label='Description'
        rules={[
          {
            required: true,
            message: 'Description cannot be blank.'
          }
        ]}
      >
        <Input.TextArea />
      </Form.Item>
    </Form>
  )
}
```

註：這邊只是寫個概念（讓你比較好閱讀），請不要複製拿去跑，一定跑不了。
註：如果你沒用過 `Form.Item` 的話，請一樣到 [官方 Demo](https://codesandbox.io/s/bl4rpu) 去玩一下，大概知道這是幹嘛用的就可以了。

首先這是一個表單的區塊，請你把注意力聚焦在 `<Form.Item>` 的 `rules` 這個 props。

這邊想做的事情是把 `rules` 的部分給抽出去寫，讓我們可以把 code 簡化成這樣：

```typescript
import { rules } from './rules'

const FormComponent = () => {
  return (
    <Form>
      <Form.Item
        name='title'
        label='Title'
        rules={rules.title} // 把 title 的規則傳入
      ></Form.Item>
      <Form.Item name='rate' label='Rate'>
        <Select className='w-full' options={starsOption} />
      </Form.Item>
      <Form.Item
        name='description'
        label='Description'
        rules={rules.description} // 把 description 的規則傳入
      >
        <Input.TextArea />
      </Form.Item>
    </Form>
  )
}
```

之所以要這樣做是為了讓 template 看起來比較簡潔一點，因為在實際專案上可能會有很多的表單欄位，如果很多欄位都有設定規則的話，看起來就會很雜亂。所以我自己會傾向把這一塊抽出去寫成另一個檔案，看起來會比較舒服，管理上也會比較方便。

接下來你可以先自己想想看，如果要達成上面的條件，`rules` 這個物件應該要怎麼寫才好？**（請先用純 JS 的方式改寫就好，先不用考慮 TS 的型別該怎麼設定）**

... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線
... 我是防雷線

答案是這樣子：

```javascript
export const rules = {
  title: [
    {
      required: true,
      message: 'Title cannot be blank.'
    }
  ],
  description: [
    {
      required: true,
      message: 'Description cannot be blank.'
    }
  ]
}
```

如果答對的話恭喜你！但答錯的話也沒關係，試著弄懂為什麼可以這樣寫就好。

回歸正題，雖然這樣子就可以運作了，但畢竟都已經寫 TS 了，所以我們還是要思考看看要怎麼設定 `rules` 的型別會比較好。如果從最後的結果來看的話，我們可以先看出底下幾個資訊：

1. `rules` 物件中需要知道所有表單欄位的 key 是什麼？
2. `rules.[key]` 中的型別必須要跟 `<Form.Item>` 的 `rules` 一致

接著就來一個一個思考。

**1. rules 物件中需要知道所有表單欄位的 key 是什麼？**

看到 `key` 應該能聯想到之前介紹過的 `keyof`。沒錯！我們只要用 `keyof` 去從**某個型別**中「把物件的 key 拿出來就可以了」！

> 不好意思，某個型別是？

那個型別前面沒有提到，所以這邊要先多做一個假設，就是一般我們在設計表單的時候，照理說會先定義一個用來儲存表單內容的型別，像這樣：

```typescript
// 建立一個表單內容的型別
export type FormData = {
  title: string
  description: string
  rate: number
}

const FormComponent = () => {
  const initialData = useRef<FormData>({
    title: '',
    description: '',
    rate: 3
  })

  return (
    {/* 加上表單預設值 */}
    <Form initialValues={initialData}>
      <Form.Item
        name='title'
        label='Title'
        rules={rules.title}
      >
      </Form.Item>
      <Form.Item name='rate' label='Rate'>
        <Select className='w-full' options={starsOption} />
      </Form.Item>
      <Form.Item
        name='description'
        label='Description'
        rules={rules.description}
      >
        <Input.TextArea />
      </Form.Item>
    </Form>
  )
}
```

這樣我們就有 `FormData` 這個型別可以用了。寫到這邊應該答案蠻明顯了，如果我們想要把每個表單欄位 key 拿出來，這樣子做就行了：

```typescript
import { FormData } from './FormComponent'

type allFormKeys = keyof FormData & string // 用 keyof 把所有 FormData 的 key 取出
```

註：如果你忘記 `& string` 是幹嘛用的，可以回 [這邊](#利用-keyof-取出物件的-key) 複習一下。

拿出來的結果會像這樣子：

![allKeys](/README-images/allKeys.png)

搞定！不過在進入下一步之前，我們還有一件事得處理。就是我們實際上需要的 key 只有其實只有 `title` 和 `description` 而已（因為只有這兩個欄位有設定規則），`rate` 是多餘的，這時候該怎麼辦呢？

這時候就要用到其中一個 TS 內建的 utility types 了，叫做 `Exclude`。這東西的用法你看下面的範例應該就大概懂了，用起來會像這樣：

```typescript
type Type1 = Exclude<allFormKeys, 'rate'> // "title" | "description"
type Type2 = Exclude<allFormKeys, 'title'> // "description" | "rate"
type Type3 = Exclude<allFormKeys, 'description'> // "title" | "rate"
```

註：utility types 的意思就是用來**產生另外一個型別**的工具。

應該沒有很難懂，所以到這邊為止，我們就處理好 `key` 的問題了，目前的 code 應該會長得像這樣：

```typescript
import { FormData } from '../../types'

type allFormKeys = keyof FormData & string
type theKeysWeNeed = Exclude<allFormKeys, 'rate'>
```

**2. 怎麼拿到 Form.Item 元件的 rules 的型別？**

這個是前面介紹過的東西，一樣兩個步驟：

1. hover 看型別
2. 複製貼上後讓 VSCode 幫你做 auto import

![get-form-item-rules-type](/README-images/get-form-item-rules-type.gif)

註：做 auto import 的時候通常需要在 `.tsx` 檔案裡面才有辦法抓到路徑，所以這邊才開兩個視窗來處理。

這樣子我們就拿到 `rules` 這個 props 需要的型別了（`Rule`），讓我們進入最後一步。

**3. 萬事俱備，只欠東風**

現在 `key` 已經準備好了，props 的型別也已經準備好了，只差最後一步了！

我們的目標是寫出一個新的型別，讓我們可以這樣子用它：

```typescript
type RulesType = { ...someting }

export const rules: RulesType  = {
  title: [
    {
      required: true,
      message: 'Title cannot be blank.'
    }
  ],
  description: [
    {
      required: true,
      message: 'Description cannot be blank.'
    }
  ]
}
```

這邊我就直接公佈答案，其實就是搭配前面介紹的 Mapped Type 來處理而已，最終結果會長這樣：

```typescript
import { FormData } from '../../types'
import { Rule } from 'antd/es/form'

//// utils
type allFormKeys = keyof FormData & string
type theKeysWeNeed = Exclude<allFormKeys, 'rate'>

//// types
type RulesType = {
  [key in theKeysWeNeed]: Rule[]
}

//// variable
export const rules: RulesType = {
  title: [
    {
      required: true,
      message: 'Title cannot be blank.'
    }
  ],
  description: [
    {
      required: true,
      message: 'Description cannot be blank.'
    }
  ]
}
```

稍微解釋一下 `type RulesType = { [key in theKeysWeNeed]: Rule[] }` 的部分。

- 首先我們知道`[key in theKeysWeNeed]` 就等於 `[key in 'title' | 'description']`，代表我們的 key 必須要有 `title` 和 `description`
- 而 `: Rule[]` 就代表每個 key 對應到的值，是 `Rule[]`（即，`Form.Item>` 的 `rules` props 需要的型別）

整個結合起來的意思就是：

> 我的物件要有 title 和 description 這兩個 key，且它們的值要符合 Rule[] 這個型別。

這樣整個範例就完成了，這就是 Mapped Type 在實戰上可以運用的地方。

我自己覺得這邊的概念稍微複雜一點，尤其是 Mapped Type 的部分。如果第一次看不太熟悉的話應該是正常的，建議可以多看幾次，應該就能慢慢能理解了。

最後恭喜！這就是整篇文章想介紹跟 TS 有關的東西，希望各位都有從這裡學到一些東西～～～

## Bonus：好物推薦

這邊是我自己推薦的一些好東西，我覺得還蠻方便的～

- [Cheat Sheet](https://www.typescriptlang.org/cheatsheets) - 快速查表
- [pretty-ts-errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors) - VSCode 套件，可以讓錯誤訊息更好讀
