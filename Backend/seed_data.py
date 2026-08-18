"""
Seed script — populates the `medicines` and `kendras` collections.

Run from the Backend folder with your venv active:
    python seed_data.py

This clears existing data in both collections before inserting, so it's
safe to re-run any time you update the data below.
"""
import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.utils.password import hash_password

medicines = [
    {"pmbi_code": "PAR500", "generic_name": "Paracetamol 500mg", "brand_name": "Crocin 500mg", "composition": "Paracetamol 500mg", "category": "Analgesic", "jan_aushadhi_mrp": 3.84, "branded_avg_mrp": 28, "saving_pct": 86, "pack_size": "Strip of 15", "manufacturer": "Aurobindo Pharma Ltd."},
    {"pmbi_code": "MET500", "generic_name": "Metformin 500mg", "brand_name": "Glycomet 500mg", "composition": "Metformin 500mg", "category": "Anti-diabetic", "jan_aushadhi_mrp": 12, "branded_avg_mrp": 55, "saving_pct": 78, "pack_size": "Strip of 10", "manufacturer": "Sun Pharmaceutical"},
    {"pmbi_code": "IBU400", "generic_name": "Ibuprofen 400mg", "brand_name": "Brufen 400mg", "composition": "Ibuprofen 400mg", "category": "Pain Relief", "jan_aushadhi_mrp": 4.88, "branded_avg_mrp": 42, "saving_pct": 88, "pack_size": "Strip of 15", "manufacturer": "Cipla Ltd."},
    {"pmbi_code": "CET10", "generic_name": "Cetirizine 10mg", "brand_name": "Cetzine 10mg", "composition": "Cetirizine 10mg", "category": "Anti-allergy", "jan_aushadhi_mrp": 4.88, "branded_avg_mrp": 22, "saving_pct": 78, "pack_size": "Strip of 10", "manufacturer": "Zydus Cadila"},
    {"pmbi_code": "AMX250", "generic_name": "Amoxicillin 250mg", "brand_name": "Amoxil 250mg", "composition": "Amoxicillin 250mg", "category": "Antibiotic", "jan_aushadhi_mrp": 8.5, "branded_avg_mrp": 85, "saving_pct": 90, "pack_size": "Strip of 10", "manufacturer": "Alkem Laboratories"},
    {"pmbi_code": "JA072", "generic_name": "Azithromycin 500mg", "brand_name": "Azithral 500", "composition": "Azithromycin 500mg", "category": "Antibiotic", "jan_aushadhi_mrp": 24, "branded_avg_mrp": 98, "saving_pct": 76, "pack_size": "Strip of 3", "manufacturer": "Karnataka Antibiotics & Pharmaceuticals Ltd."},
    {"pmbi_code": "JA136", "generic_name": "Gliclazide 80mg", "brand_name": "Diamicron 80", "composition": "Gliclazide 80mg", "category": "Anti-diabetic", "jan_aushadhi_mrp": 9, "branded_avg_mrp": 42, "saving_pct": 79, "pack_size": "Strip of 10", "manufacturer": "IPCA Laboratories Ltd."},
    {"pmbi_code": "JA264", "generic_name": "Amlodipine 5mg", "brand_name": "Amlong 5", "composition": "Amlodipine 5mg", "category": "Cardiac/BP", "jan_aushadhi_mrp": 4.5, "branded_avg_mrp": 36, "saving_pct": 87, "pack_size": "Strip of 10", "manufacturer": "Bal Pharma Ltd."},
    {"pmbi_code": "JA266", "generic_name": "Atorvastatin 10mg", "brand_name": "Atorva 10", "composition": "Atorvastatin 10mg", "category": "Cardiac/Cholesterol", "jan_aushadhi_mrp": 8, "branded_avg_mrp": 96, "saving_pct": 92, "pack_size": "Strip of 10", "manufacturer": "Macleods Pharmaceuticals Ltd."},
    {"pmbi_code": "JA212", "generic_name": "Pantoprazole 40mg", "brand_name": "Pantocid 40", "composition": "Pantoprazole 40mg", "category": "Gastro", "jan_aushadhi_mrp": 9, "branded_avg_mrp": 112, "saving_pct": 92, "pack_size": "Strip of 10", "manufacturer": "Micro Labs Ltd."},
    {"pmbi_code": "JA186", "generic_name": "Domperidone 10mg", "brand_name": "Domstal 10", "composition": "Domperidone 10mg", "category": "Gastro", "jan_aushadhi_mrp": 4, "branded_avg_mrp": 29, "saving_pct": 86, "pack_size": "Strip of 10", "manufacturer": "Hindustan Antibiotics Ltd."},
    {"pmbi_code": "JA045", "generic_name": "Amoxycillin 500mg", "brand_name": "Mox 500", "composition": "Amoxycillin 500mg", "category": "Antibiotic", "jan_aushadhi_mrp": 15, "branded_avg_mrp": 112, "saving_pct": 87, "pack_size": "Strip of 10", "manufacturer": "Aurobindo Pharma Ltd."},
    {"pmbi_code": "JA289", "generic_name": "Losartan 50mg", "brand_name": "Losar 50", "composition": "Losartan Potassium 50mg", "category": "Cardiac/BP", "jan_aushadhi_mrp": 9, "branded_avg_mrp": 92, "saving_pct": 90, "pack_size": "Strip of 10", "manufacturer": "Sun Pharmaceutical"},
    {"pmbi_code": "JA300", "generic_name": "Telmisartan 40mg", "brand_name": "Telma 40", "composition": "Telmisartan 40mg", "category": "Cardiac/BP", "jan_aushadhi_mrp": 10, "branded_avg_mrp": 132, "saving_pct": 92, "pack_size": "Strip of 10", "manufacturer": "Zydus Cadila"},
    {"pmbi_code": "JA523", "generic_name": "Naproxen 500mg", "brand_name": "Naprosyn 500", "composition": "Naproxen 500mg", "category": "Pain Relief", "jan_aushadhi_mrp": 18, "branded_avg_mrp": 88, "saving_pct": 80, "pack_size": "Strip of 15", "manufacturer": "Cipla Ltd."},
    {"pmbi_code": "JA207", "generic_name": "Omeprazole 20mg", "brand_name": "Omez 20", "composition": "Omeprazole 20mg", "category": "Gastro", "jan_aushadhi_mrp": 6, "branded_avg_mrp": 68, "saving_pct": 91, "pack_size": "Strip of 10", "manufacturer": "Alkem Laboratories"},
    {"pmbi_code": "JA138", "generic_name": "Glimepiride 2mg", "brand_name": "Amaryl 2", "composition": "Glimepiride 2mg", "category": "Anti-diabetic", "jan_aushadhi_mrp": 5, "branded_avg_mrp": 47, "saving_pct": 89, "pack_size": "Strip of 10", "manufacturer": "Sun Pharmaceutical"},
    {"pmbi_code": "JA790", "generic_name": "Aspirin 75mg", "brand_name": "Ecosprin 75", "composition": "Aspirin Gastro-resistant 75mg", "category": "Cardiac", "jan_aushadhi_mrp": 3, "branded_avg_mrp": 20, "saving_pct": 85, "pack_size": "Strip of 14", "manufacturer": "USV Pvt. Ltd."},
    {"pmbi_code": "JA248", "generic_name": "Levocetirizine 5mg", "brand_name": "Levocet 5", "composition": "Levocetirizine 5mg", "category": "Anti-allergy", "jan_aushadhi_mrp": 5, "branded_avg_mrp": 36, "saving_pct": 86, "pack_size": "Strip of 10", "manufacturer": "Zydus Cadila"},
    {"pmbi_code": "JA086", "generic_name": "Ciprofloxacin 500mg", "brand_name": "Ciplox 500", "composition": "Ciprofloxacin Hydrochloride 500mg", "category": "Antibiotic", "jan_aushadhi_mrp": 14, "branded_avg_mrp": 112, "saving_pct": 87, "pack_size": "Strip of 10", "manufacturer": "Cipla Ltd."},
    {"pmbi_code": "JA217", "generic_name": "Ranitidine 150mg", "brand_name": "Rantac 150", "composition": "Ranitidine 150mg", "category": "Gastro", "jan_aushadhi_mrp": 5, "branded_avg_mrp": 39, "saving_pct": 87, "pack_size": "Strip of 10", "manufacturer": "J.B. Chemicals"},
    {"pmbi_code": "JA251", "generic_name": "Montelukast 10mg", "brand_name": "Montair 10", "composition": "Montelukast Sodium 10mg", "category": "Respiratory", "jan_aushadhi_mrp": 25, "branded_avg_mrp": 152, "saving_pct": 84, "pack_size": "Strip of 10", "manufacturer": "Cipla Ltd."},
    {"pmbi_code": "JA759", "generic_name": "Rosuvastatin 10mg", "brand_name": "Rosuvas 10", "composition": "Rosuvastatin 10mg", "category": "Cardiac/Cholesterol", "jan_aushadhi_mrp": 28, "branded_avg_mrp": 178, "saving_pct": 84, "pack_size": "Strip of 15", "manufacturer": "Macleods Pharmaceuticals Ltd."},
    {"pmbi_code": "JA224", "generic_name": "Folic Acid 5mg", "brand_name": "Folvite 5", "composition": "Folic Acid 5mg", "category": "Vitamin/Supplement", "jan_aushadhi_mrp": 2.5, "branded_avg_mrp": 15, "saving_pct": 83, "pack_size": "Strip of 15", "manufacturer": "Bal Pharma Ltd."},
    {"pmbi_code": "JA092", "generic_name": "Doxycycline 100mg", "brand_name": "Doxy 1", "composition": "Doxycycline 100mg", "category": "Antibiotic", "jan_aushadhi_mrp": 7, "branded_avg_mrp": 56, "saving_pct": 87, "pack_size": "Strip of 10", "manufacturer": "IPCA Laboratories Ltd."},
]

kendras = [
    {"name": "MedPlus Jan Aushadhi Kendra", "address": "Sayyaji Rao Road, Mysuru", "phone": "+91 98765 43210", "rating": 4.5,
     "location": {"type": "Point", "coordinates": [76.6551, 12.3052]},
     "stock": [
         {"pmbi_code": "PAR500", "total_qty": 45, "status": "in_stock", "batches": [{"batch_number": "MFG/2024/PAR500/B142", "expiry_date": datetime(2027, 3, 1), "quantity": 45, "manufacturer": "Aurobindo Pharma Ltd."}]},
         {"pmbi_code": "MET500", "total_qty": 20, "status": "in_stock", "batches": [{"batch_number": "MFG/2024/MET500/B201", "expiry_date": datetime(2027, 6, 1), "quantity": 20, "manufacturer": "Sun Pharmaceutical"}]},
         {"pmbi_code": "IBU400", "total_qty": 60, "status": "in_stock", "batches": [{"batch_number": "MFG/2024/IBU400/B099", "expiry_date": datetime(2027, 9, 1), "quantity": 60, "manufacturer": "Cipla Ltd."}]},
         {"pmbi_code": "CET10", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "AMX250", "total_qty": 14, "status": "in_stock", "batches": [{"batch_number": "MFG/2024/AMX250/B312", "expiry_date": datetime(2027, 5, 1), "quantity": 14, "manufacturer": "Alkem Laboratories"}]},
         {"pmbi_code": "JA072", "total_qty": 36, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA072/B011", "expiry_date": datetime(2027, 4, 1), "quantity": 36, "manufacturer": "Karnataka Antibiotics & Pharmaceuticals Ltd."}]},
         {"pmbi_code": "JA264", "total_qty": 50, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA264/B022", "expiry_date": datetime(2027, 7, 1), "quantity": 50, "manufacturer": "Bal Pharma Ltd."}]},
         {"pmbi_code": "JA266", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA212", "total_qty": 15, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA212/B033", "expiry_date": datetime(2027, 5, 1), "quantity": 15, "manufacturer": "Micro Labs Ltd."}]},
         {"pmbi_code": "JA045", "total_qty": 6, "status": "low_stock", "batches": [{"batch_number": "MFG/2025/JA045/B044", "expiry_date": datetime(2027, 3, 1), "quantity": 6, "manufacturer": "Aurobindo Pharma Ltd."}]},
         {"pmbi_code": "JA300", "total_qty": 28, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA300/B055", "expiry_date": datetime(2027, 9, 1), "quantity": 28, "manufacturer": "Zydus Cadila"}]},
         {"pmbi_code": "JA207", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA086", "total_qty": 19, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA086/B066", "expiry_date": datetime(2027, 8, 1), "quantity": 19, "manufacturer": "Cipla Ltd."}]},
         {"pmbi_code": "JA251", "total_qty": 4, "status": "low_stock", "batches": [{"batch_number": "MFG/2025/JA251/B077", "expiry_date": datetime(2027, 6, 1), "quantity": 4, "manufacturer": "Cipla Ltd."}]},
         {"pmbi_code": "JA759", "total_qty": 22, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA759/B088", "expiry_date": datetime(2027, 10, 1), "quantity": 22, "manufacturer": "Macleods Pharmaceuticals Ltd."}]},
     ]},
    {"name": "Apollo Jan Aushadhi Kendra", "address": "JLB Road, Mysuru", "phone": "+91 98765 11111", "rating": 4.7,
     "location": {"type": "Point", "coordinates": [76.6480, 12.2990]},
     "stock": [
         {"pmbi_code": "PAR500", "total_qty": 12, "status": "in_stock", "batches": [{"batch_number": "MFG/2024/PAR500/B138", "expiry_date": datetime(2027, 1, 1), "quantity": 12, "manufacturer": "Aurobindo Pharma Ltd."}]},
         {"pmbi_code": "MET500", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "IBU400", "total_qty": 30, "status": "in_stock", "batches": [{"batch_number": "MFG/2024/IBU400/B101", "expiry_date": datetime(2027, 11, 1), "quantity": 30, "manufacturer": "Cipla Ltd."}]},
         {"pmbi_code": "CET10", "total_qty": 18, "status": "in_stock", "batches": [{"batch_number": "MFG/2024/CET10/B055", "expiry_date": datetime(2027, 8, 1), "quantity": 18, "manufacturer": "Zydus Cadila"}]},
         {"pmbi_code": "AMX250", "total_qty": 9, "status": "in_stock", "batches": [{"batch_number": "MFG/2024/AMX250/B309", "expiry_date": datetime(2027, 3, 1), "quantity": 9, "manufacturer": "Alkem Laboratories"}]},
         {"pmbi_code": "JA072", "total_qty": 36, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA072/B011", "expiry_date": datetime(2027, 4, 1), "quantity": 36, "manufacturer": "Karnataka Antibiotics & Pharmaceuticals Ltd."}]},
         {"pmbi_code": "JA264", "total_qty": 50, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA264/B022", "expiry_date": datetime(2027, 7, 1), "quantity": 50, "manufacturer": "Bal Pharma Ltd."}]},
         {"pmbi_code": "JA266", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA212", "total_qty": 15, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA212/B033", "expiry_date": datetime(2027, 5, 1), "quantity": 15, "manufacturer": "Micro Labs Ltd."}]},
         {"pmbi_code": "JA045", "total_qty": 6, "status": "low_stock", "batches": [{"batch_number": "MFG/2025/JA045/B044", "expiry_date": datetime(2027, 3, 1), "quantity": 6, "manufacturer": "Aurobindo Pharma Ltd."}]},
         {"pmbi_code": "JA300", "total_qty": 28, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA300/B055", "expiry_date": datetime(2027, 9, 1), "quantity": 28, "manufacturer": "Zydus Cadila"}]},
         {"pmbi_code": "JA207", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA086", "total_qty": 19, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA086/B066", "expiry_date": datetime(2027, 8, 1), "quantity": 19, "manufacturer": "Cipla Ltd."}]},
         {"pmbi_code": "JA251", "total_qty": 4, "status": "low_stock", "batches": [{"batch_number": "MFG/2025/JA251/B077", "expiry_date": datetime(2027, 6, 1), "quantity": 4, "manufacturer": "Cipla Ltd."}]},
         {"pmbi_code": "JA759", "total_qty": 22, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA759/B088", "expiry_date": datetime(2027, 10, 1), "quantity": 22, "manufacturer": "Macleods Pharmaceuticals Ltd."}]},
     ]},
    {"name": "City Jan Aushadhi Kendra", "address": "Vijayanagar, Mysuru", "phone": "+91 98765 22222", "rating": 4.1,
     "location": {"type": "Point", "coordinates": [76.6180, 12.3150]},
     "stock": [
         {"pmbi_code": "PAR500", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "MET500", "total_qty": 8, "status": "low_stock", "batches": [{"batch_number": "MFG/2024/MET500/B198", "expiry_date": datetime(2027, 4, 1), "quantity": 8, "manufacturer": "Sun Pharmaceutical"}]},
         {"pmbi_code": "IBU400", "total_qty": 5, "status": "low_stock", "batches": [{"batch_number": "MFG/2024/IBU400/B088", "expiry_date": datetime(2027, 2, 1), "quantity": 5, "manufacturer": "Cipla Ltd."}]},
         {"pmbi_code": "CET10", "total_qty": 22, "status": "in_stock", "batches": [{"batch_number": "MFG/2024/CET10/B057", "expiry_date": datetime(2027, 10, 1), "quantity": 22, "manufacturer": "Zydus Cadila"}]},
         {"pmbi_code": "AMX250", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA212", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA045", "total_qty": 31, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA045/B199", "expiry_date": datetime(2027, 5, 1), "quantity": 31, "manufacturer": "Aurobindo Pharma Ltd."}]},
         {"pmbi_code": "JA289", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA523", "total_qty": 14, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA523/B210", "expiry_date": datetime(2027, 10, 1), "quantity": 14, "manufacturer": "Cipla Ltd."}]},
         {"pmbi_code": "JA207", "total_qty": 8, "status": "low_stock", "batches": [{"batch_number": "MFG/2025/JA207/B221", "expiry_date": datetime(2027, 4, 1), "quantity": 8, "manufacturer": "Alkem Laboratories"}]},
         {"pmbi_code": "JA790", "total_qty": 45, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA790/B232", "expiry_date": datetime(2027, 12, 1), "quantity": 45, "manufacturer": "USV Pvt. Ltd."}]},
         {"pmbi_code": "JA086", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA251", "total_qty": 16, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA251/B243", "expiry_date": datetime(2027, 9, 1), "quantity": 16, "manufacturer": "Cipla Ltd."}]},
         {"pmbi_code": "JA759", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA224", "total_qty": 60, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA224/B254", "expiry_date": datetime(2027, 11, 1), "quantity": 60, "manufacturer": "Bal Pharma Ltd."}]},
     ]},
    {"name": "Kadri Jan Aushadhi Kendra", "address": "Kadri Road, Mangalore", "phone": "+91 98765 33333", "rating": 4.3,
     "location": {"type": "Point", "coordinates": [74.8565, 12.9150]},
     "stock": [
         {"pmbi_code": "PAR500", "total_qty": 40, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/PAR500/M001", "expiry_date": datetime(2027, 5, 1), "quantity": 40, "manufacturer": "Aurobindo Pharma Ltd."}]},
         {"pmbi_code": "MET500", "total_qty": 25, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/MET500/M002", "expiry_date": datetime(2027, 6, 1), "quantity": 25, "manufacturer": "Sun Pharmaceutical"}]},
         {"pmbi_code": "JA072", "total_qty": 20, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA072/M003", "expiry_date": datetime(2027, 4, 1), "quantity": 20, "manufacturer": "Karnataka Antibiotics & Pharmaceuticals Ltd."}]},
         {"pmbi_code": "JA264", "total_qty": 33, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA264/M004", "expiry_date": datetime(2027, 7, 1), "quantity": 33, "manufacturer": "Bal Pharma Ltd."}]},
         {"pmbi_code": "JA212", "total_qty": 7, "status": "low_stock", "batches": [{"batch_number": "MFG/2025/JA212/M005", "expiry_date": datetime(2027, 3, 1), "quantity": 7, "manufacturer": "Micro Labs Ltd."}]},
         {"pmbi_code": "JA045", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA759", "total_qty": 18, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA759/M006", "expiry_date": datetime(2027, 10, 1), "quantity": 18, "manufacturer": "Macleods Pharmaceuticals Ltd."}]},
         {"pmbi_code": "JA224", "total_qty": 50, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA224/M007", "expiry_date": datetime(2027, 11, 1), "quantity": 50, "manufacturer": "Bal Pharma Ltd."}]},
     ]},
    {"name": "Balmatta Jan Aushadhi Kendra", "address": "Balmatta Road, Mangalore", "phone": "+91 98765 44444", "rating": 4.6,
     "location": {"type": "Point", "coordinates": [74.8490, 12.9080]},
     "stock": [
         {"pmbi_code": "IBU400", "total_qty": 28, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/IBU400/M008", "expiry_date": datetime(2027, 9, 1), "quantity": 28, "manufacturer": "Cipla Ltd."}]},
         {"pmbi_code": "CET10", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA136", "total_qty": 15, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA136/M009", "expiry_date": datetime(2027, 4, 1), "quantity": 15, "manufacturer": "IPCA Laboratories Ltd."}]},
         {"pmbi_code": "JA266", "total_qty": 29, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA266/M010", "expiry_date": datetime(2027, 11, 1), "quantity": 29, "manufacturer": "Macleods Pharmaceuticals Ltd."}]},
         {"pmbi_code": "JA289", "total_qty": 5, "status": "low_stock", "batches": [{"batch_number": "MFG/2025/JA289/M011", "expiry_date": datetime(2027, 7, 1), "quantity": 5, "manufacturer": "Sun Pharmaceutical"}]},
         {"pmbi_code": "JA300", "total_qty": 22, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA300/M012", "expiry_date": datetime(2027, 9, 1), "quantity": 22, "manufacturer": "Zydus Cadila"}]},
         {"pmbi_code": "JA086", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA251", "total_qty": 12, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA251/M013", "expiry_date": datetime(2027, 6, 1), "quantity": 12, "manufacturer": "Cipla Ltd."}]},
     ]},
    {"name": "Attavar Jan Aushadhi Kendra", "address": "Attavar, Mangalore", "phone": "+91 98765 55555", "rating": 4.0,
     "location": {"type": "Point", "coordinates": [74.8610, 12.9200]},
     "stock": [
         {"pmbi_code": "AMX250", "total_qty": 6, "status": "low_stock", "batches": [{"batch_number": "MFG/2025/AMX250/M014", "expiry_date": datetime(2027, 5, 1), "quantity": 6, "manufacturer": "Alkem Laboratories"}]},
         {"pmbi_code": "JA523", "total_qty": 19, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA523/M015", "expiry_date": datetime(2027, 10, 1), "quantity": 19, "manufacturer": "Cipla Ltd."}]},
         {"pmbi_code": "JA207", "total_qty": 10, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA207/M016", "expiry_date": datetime(2027, 4, 1), "quantity": 10, "manufacturer": "Alkem Laboratories"}]},
         {"pmbi_code": "JA138", "total_qty": 0, "status": "out_of_stock", "batches": []},
         {"pmbi_code": "JA790", "total_qty": 40, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA790/M017", "expiry_date": datetime(2027, 12, 1), "quantity": 40, "manufacturer": "USV Pvt. Ltd."}]},
         {"pmbi_code": "JA248", "total_qty": 4, "status": "low_stock", "batches": [{"batch_number": "MFG/2025/JA248/M018", "expiry_date": datetime(2027, 6, 1), "quantity": 4, "manufacturer": "Zydus Cadila"}]},
         {"pmbi_code": "JA217", "total_qty": 14, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA217/M019", "expiry_date": datetime(2027, 3, 1), "quantity": 14, "manufacturer": "J.B. Chemicals"}]},
         {"pmbi_code": "JA092", "total_qty": 25, "status": "in_stock", "batches": [{"batch_number": "MFG/2025/JA092/M020", "expiry_date": datetime(2027, 8, 1), "quantity": 25, "manufacturer": "IPCA Laboratories Ltd."}]},
     ]},
]


async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    print(f"Connected to MongoDB: {settings.DATABASE_NAME}")

    now = datetime.utcnow()
    for m in medicines:
        m["created_at"] = now
        m["updated_at"] = now
        m["is_active"] = True
    for k in kendras:
        k["created_at"] = now
        k["updated_at"] = now
        k["is_active"] = True

    await db["medicines"].delete_many({})
    await db["kendras"].delete_many({})
    print("Cleared old data")

    result1 = await db["medicines"].insert_many(medicines)
    print(f"Medicines seeded: {len(result1.inserted_ids)}")

    result2 = await db["kendras"].insert_many(kendras)
    print(f"Kendras seeded: {len(result2.inserted_ids)}")

    # ── Test login accounts, one per role ───────────────────────────────
    # The register API only ever creates USER accounts, so PHARMACY/ADMIN
    # accounts can only exist via seeding (or manual DB insert) until a
    # proper pharmacy registration/approval flow exists. The pharmacy
    # account is linked to a Kendra via assigned_kendra_id — that's the
    # only ownership link the backend checks now (see
    # kendra_service.py::_verify_kendra_ownership).
    # Password for all three: Test@1234
    first_kendra_id = str(result2.inserted_ids[0])
    test_users = [
        {"full_name": "Demo Customer",       "email": "user@test.com",     "phone_number": "9876543210", "role": "USER",     "assigned_kendra_id": None},
        {"full_name": "Demo Pharmacy Owner", "email": "pharmacy@test.com", "phone_number": "9876543211", "role": "PHARMACY", "assigned_kendra_id": first_kendra_id},
        {"full_name": "Demo Admin",          "email": "admin@test.com",    "phone_number": "9876543212", "role": "ADMIN",    "assigned_kendra_id": None},
    ]
    await db["users"].delete_many({"email": {"$in": [u["email"] for u in test_users]}})
    for u in test_users:
        u["hashed_password"] = hash_password("Test@1234")
        u["status"] = "ACTIVE"
        u["is_email_verified"] = True
        u["last_login"] = None
        u["created_at"] = now
        u["updated_at"] = now
    await db["users"].insert_many(test_users)
    print(f"Test users seeded: {len(test_users)}")
    print(f"Linked '{kendras[0]['name']}' to pharmacy@test.com (assigned_kendra_id)")
    print("  Login with any of these (password: 'Test@1234' for all):")
    for u in test_users:
        print(f"    {u['role']:10s} -> {u['email']}")

    client.close()
    print("Done! Your database is ready.")


if __name__ == "__main__":
    asyncio.run(seed())