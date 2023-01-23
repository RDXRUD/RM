using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ResourceManagerAPI.Models;

namespace ResourceManagerAPI.Models
{
    public partial class SkillDBContext : DbContext
    {
        public SkillDBContext(DbContextOptions<SkillDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Skill> skill { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Skill>(entity =>
            {

                entity.Property(e => e.resource_name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.email_id)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                //  entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.skill_group)
                      .HasMaxLength(250)
                      .IsUnicode(false);
                entity.Property(e => e.skill)
                    .HasMaxLength(250)
                    .IsUnicode(false);
                entity.Property(e => e.master_resource_uid)
                    .HasMaxLength(250)
                    .IsUnicode(false);
                entity.Property(e => e.skill_set_uid)
                   .HasMaxLength(250)
                   .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}