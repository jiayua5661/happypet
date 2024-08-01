資料庫名稱: happypet_DB

在 htdocs       git clone https://github.com/jiayua5661/happypet.git

VS code 裡安裝 延伸模組Git Graph 有圖形化git可以看

拉檔案下來 git pull https://github.com/jiayua5661/happypet.git 分支名稱

開新分支 git branch 分支名稱

切換分支 git checkout 分支名稱


push 到分支上

    git add .

    git commit -m "提交訊息"

    git push https://github.com/jiayua5661/happypet.git 分支名稱


*****如果分支出去後有刪除原本檔案 合併回main 可能會把 main 的 那一行 code 也刪除*****

merge 回main
    
    git checkout main

    git merge 分支名稱

    處理衝突

    git push