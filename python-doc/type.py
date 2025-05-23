# ＜ 整数, 小数, 文字列の違い ＞

1      # ----- これは整数
1.5    # ----- これは小数（浮動小数点数）
"1.5"  # ----- これは文字列

# 整数のイメージ = 現金
#     _____
#    (  1  )     円
#     ‾‾‾‾‾
#
# 小数のイメージ = 電子マネー（小数ができるようになった世界線）
#    (( 1.5 ))   円
#
# 文字列のイメージ = そこらへんの紙に書いた文字
#  _____________
#  |    1.5    |
#  ‾‾‾‾‾‾‾‾‾‾‾‾‾

1.5 + 2   = 3.5  # ----- 小数　＋　整数　＝　小数
1.5 + 2.5 = 4.0  # ----- 電子マネーを現金に戻すことはできないことにする

"123" + "45" = "12345"  # ----- 文字列　＋　文字列　＝　文字列
"1.5" + "2"  = "1.52"   # ----- そこらへんの紙に書いた文字をつなげただけ

1.5 + "2"   # ----- 小数　＋　文字列　＝　エラー
"123" + 45  # ----- そこらへんの紙に書いた文字は単純にお金にすることはできない

# printすると？
print(1.5)    #  1.5
print("1.5")  #  1.5
# （本当は円とかいう単位はないので）数字だけが文字列と同じように出力される