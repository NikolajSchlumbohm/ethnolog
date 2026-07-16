import os
base_dir = "e_rezept/pdfs_specific" 
dir_bundestag = "Stenografische_Berichte"
dir_bundestag_drucksachen = "Bundestag_Drucksachen"
dir_bundesrat = "Bundesrat"

for filename in os.listdir(os.path.join(base_dir, dir_bundesrat)):
    if not (filename.startswith("202") or filename.startswith("201")):
        newname = ""
        year = filename.split("-")[-1].split(".")[0]
        print(filename , newname, year)
        newname = "20"+str(year)+"-"+filename.replace("-"+str(year)+".pdf", ".pdf")
        print(newname)
        if "B" in newname:
            newname = newname.replace("B", "")
            print("B: ",newname)
        if newname in os.listdir(os.path.join(base_dir, dir_bundesrat)):
            newname = newname.replace(".pdf", "_2.pdf")
        os.rename(os.path.join(base_dir, dir_bundesrat, filename), os.path.join(base_dir, dir_bundesrat, newname))