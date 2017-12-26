import React from 'react'

// フィルタリング指定リンクのコンポーネント
const Link = ({
  active,
  children, // 呼び出し元の開始/終了タグの間にある要素が入る特別なprops
  onClick  // このコンポーネントが示すフィルタの値にvisibilityFilterを変更
}) => {
  if (active) {  // 現在表示中の要素は状態がわかるようにspanで返却
    return <span>{children}</span>
  }

  return (  // 現在の状態以外はaで返却
    <a href='#'
    onClick={e => {
      e.preventDefault();  // href属性へのクリックでブラウザがトップまでスクロールを勝手にしてしまうことを抑制
      onClick();
    }}
    >
    {children}
    </a>
  );
};

export default Link;