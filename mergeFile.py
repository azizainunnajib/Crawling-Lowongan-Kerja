import pandas as pd
import glob
import os

# setting the path for joining multiple files
files = os.path.join("E:\\APPS_\\Crawling Lowongan Kerja\\Result\\", "jobstreet*.csv")

# list of merged files returned
files = glob.glob(files)

print("Resultant CSV after joining all CSV files at a particular location...");

# joining files with concat and read_csv
df = pd.concat(map(pd.read_csv, files), ignore_index=True)
# df.to_csv('mergeFile.csv', encoding='utf-8')
ids = df["id"]
# df.to_csv('output.csv', columns = header)
for i in ids:
  print(i)

# print(df)