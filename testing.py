import pandas as pd

df = pd.read_csv('output.csv')
ids = df["id"]
idsClean = ids.drop_duplicates()
print(f'ids: {len(ids)}')
print(f' idsClean: {len(idsClean)}')